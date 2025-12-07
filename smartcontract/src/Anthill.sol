// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IMemeCoinFactory {
    function createMemeCoin(string calldata name, address leader) external returns (address);
}

interface IColonyLevelCalculator {
    function calculateColonyLevel(uint256 colonyExp) external pure returns (uint256);
}

contract Anthill {
    struct User {
        uint256 level;
        uint256 experience;
        uint256 contribution;
        address colony;
        uint256 lastActionTime;
        uint256 attack;          // 공격력
        uint256 defense;          // 방어력
        uint256 virality;          // 소셜 활동을 통한 XP 추가 획득량 증가 스탯
        uint256 chainPower;       // On-chain 활동을 통한 XP 추가 획득량 증가 스탯
        uint256 unallocatedPoints; // 미분배 포인트
    }

    struct Colony {
        address leader;
        uint256 level;
        uint256 colonyExp; // 콜로니에 속한 유저들의 exp sum
        string name;
        address memeCoin;
        uint256 durability;
        address enemy;
        uint256 memberCount;
    }

    enum StatType {
        Attack,
        Defense,
        Virality,
        ChainPower
    }

    mapping(address => User) public users;
    mapping(address => Colony) public colonies;
    
    mapping(address => mapping(address => uint256)) public warDeclaredAt;
    mapping(address => mapping(address => uint256)) public allianceExpiry;
    
    // 1. 동맹 요청 pending 저장용 매핑
    mapping(bytes32 => bool) public pendingAllianceRequests;
    
    mapping(address => uint256) public startWarTime;
    mapping(address => uint256) public endWarTime;

    IMemeCoinFactory public memeFactory;
    IColonyLevelCalculator public calculator;

    uint256 public constant ACTION_COOLDOWN = 20 minutes;
    uint256 public constant WAR_DURATION = 24 hours;
    uint256 public constant ALLIANCE_DURATION = 24 hours;
    uint256 public constant XP_EARNED_BY_ONCHAIN = 200;
    uint256 public constant COLONY_CREATION_FEE = 10 ether;
    uint256 public constant BASE_DURABILITY = 2000000;
    address public authorizedExpDistributor = 0xF79b96fB81a11e951D3C6eBcd990A46aAc064763;
    address public colonyLevelCalculator = 0xBE44cd6285Dd577cFBBe86c74303240F30E30D5e;

    event Registered(address indexed user);
    event Login(address indexed user);
    event ColonyCreated(address indexed leader, address indexed colony, string name);
    event JoinedColony(address indexed user, address indexed colony);
    event WarDeclared(address indexed fromColony, string fromName, address indexed toColony, string toName, uint256 endsAt);
    event AllianceDeclared(address indexed fromColony, string fromName, address indexed toColony, string toName, uint256 endsAt);
    event AllianceRequested(address indexed fromColony, string fromName, address indexed toColony, string toName, uint256 endsAt);
    event AllianceAccepted(address indexed fromColony, string fromName, address indexed toColony, string toName, uint256 endsAt);
    event AllianceRequestCancelled(address indexed fromColony, string fromName, address indexed toColony, string toName);
    event Developed(address indexed user, address indexed colony, uint256 development);
    event Defended(address indexed user, address indexed colony, uint256 defence);
    event Attacked(address indexed attacker, address indexed fromColony, address indexed toColony, uint256 damage);
    event DurabilityUpdated(address indexed colony, uint256 newDurability);
    event LeftColony(address indexed user, address indexed colony);
    event UserGetExpAndContribution(address indexed user, uint256 expAmount, uint256 contributionAmount);
    event LeadershipTransferred(address indexed colony, address indexed oldLeader, address indexed newLeader);
    event StatsAllocated(address indexed user, StatType statType, uint256 amount, uint256 unallocatedPoints);
    event Defeated(address indexed attackColony, string attackColonyName, address indexed defeatedColony, string defeatedColonyName, uint256 defeatedTime);
    event LevelUpdated(address indexed user, uint256 updatedLevel, uint256 unallocatedPoints);

    constructor(address _memeFactory) {
        memeFactory = IMemeCoinFactory(_memeFactory);
        calculator = IColonyLevelCalculator(colonyLevelCalculator);
    }

    modifier onlyLeader(address colony) {
        require(colonies[colony].leader == msg.sender, "Only leader");
        _;
    }

    modifier checkStatPoints() {
        User memory user = users[msg.sender];
        uint256 curUserStatPointsCnt = user.attack + user.defense + user.virality + user.chainPower + user.unallocatedPoints;
        require(curUserStatPointsCnt != user.level * 5 - 4, "Invalid Stat Points");
        _;
    }

    modifier onlyAuthorized() {
        require(msg.sender == authorizedExpDistributor || msg.sender == address(this), "Unauthorized");
        _;
    }

    function _createUser(address user) internal {
        users[user] = User({
            level: 1,
            experience: 0,
            contribution: 0,
            colony: address(0),
            lastActionTime: block.timestamp >= ACTION_COOLDOWN ? block.timestamp - ACTION_COOLDOWN : 0,
            attack: 1,
            defense: 1,
            virality: 1,
            chainPower: 1,
            unallocatedPoints: 0
        });
    }

    function _requireInColonyAndCooldown() internal view returns (address colony) {
        colony = users[msg.sender].colony;
        require(colony != address(0), "Not in colony");
        require(block.timestamp >= users[msg.sender].lastActionTime + ACTION_COOLDOWN, "Cooldown");
    }

    function _isAtWar(address colony) internal view returns (bool) {
        uint256 t = block.timestamp;
        return t > 0 && (startWarTime[colony] > 0 && t >= startWarTime[colony] && t < endWarTime[colony]) && colonies[colony].enemy != address(0);
    }

    function _isAllied(address a, address b) internal view returns (bool) {
        uint256 t = allianceExpiry[a][b];
        return t > 0 && block.timestamp < t;
    }

    function _getRequestKey(address from, address to) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(from, to));
    }

    function updateUserLevel(uint256 updatedLevel, uint256 exp) external checkStatPoints {
        require(exp == users[msg.sender].experience, "Invalid User Experience");

        // User 레벨이 갱신되는지 확인
        uint256 curLevel = users[msg.sender].level;

        // 갱신되었다면, 레벨을 올리고 새로운 스탯포인트를 준다.
        if(updatedLevel > curLevel)
        {
            users[msg.sender].level = updatedLevel;
            users[msg.sender].unallocatedPoints += (updatedLevel - curLevel) * 5;
        }

        emit LevelUpdated(msg.sender, users[msg.sender].level, users[msg.sender].unallocatedPoints);
    }

    // ====================== CORE ======================
    function register() external {

        if (users[msg.sender].level > 0) {
            // revert 대신 이벤트 날린다.
            emit Login(msg.sender);
        }
        else
        {
            _createUser(msg.sender);
            emit Registered(msg.sender);
            emit Login(msg.sender);
        }
    }

    function createColony(string calldata name) external payable {
        require(users[msg.sender].colony == address(0), "Already in colony");
        require(msg.value >= COLONY_CREATION_FEE, "Not Enough $M");

        address memeCoin = memeFactory.createMemeCoin(name, msg.sender);
        address colony = memeCoin;

        colonies[colony] = Colony(msg.sender, 1, users[msg.sender].experience, name, colony, BASE_DURABILITY, address(0), 1);

        users[msg.sender].colony = colony;

        emit ColonyCreated(msg.sender, colony, name);
        emit LeadershipTransferred(colony, address(0), msg.sender);
        emit JoinedColony(msg.sender, colony);
    }

    function joinColony(address colony) external {
        require(users[msg.sender].colony == address(0), "Already in colony");
        require(colonies[colony].leader != address(0), "Not exist");

        users[msg.sender].colony = colony;       
        colonies[colony].memberCount++;
        colonies[colony].colonyExp += users[msg.sender].experience;

        emit JoinedColony(msg.sender, colony);
    }

    function leaveColony() external {
        address colony = users[msg.sender].colony;
        
        require(colony != address(0), "Not in colony");
        require(colonies[colony].leader != msg.sender, "Leader cannot leave");


        users[msg.sender].colony = address(0);
        colonies[colony].memberCount--;
        colonies[colony].colonyExp -= users[msg.sender].experience;
        
        emit LeftColony(msg.sender, colony);
    }

    function transferLeadership(address newLeader) external onlyLeader(users[msg.sender].colony) {
        address colony = users[msg.sender].colony;
        require(colonies[colony].leader == msg.sender, "Only leader");
        require(users[newLeader].colony == colony, "Must be member");
        colonies[colony].leader = newLeader;
        emit LeadershipTransferred(colony, msg.sender, newLeader);
    }

    function declareWar(address targetColony) external {
        address my = users[msg.sender].colony;
        require(my != address(0) && colonies[targetColony].leader != address(0) && my != targetColony);
        require(colonies[my].leader == msg.sender, "Only leader");
        require(!_isAtWar(my) && !_isAllied(my, targetColony));

        uint256 t = block.timestamp;
        warDeclaredAt[my][targetColony] = t;
        warDeclaredAt[targetColony][my] = t;

        startWarTime[my] = t + 2 hours;
        startWarTime[targetColony] = t + 2 hours;

        endWarTime[my] = t + WAR_DURATION + 2 hours;
        endWarTime[targetColony] = t + WAR_DURATION + 2 hours;

        colonies[my].durability = colonies[my].level * BASE_DURABILITY;
        colonies[targetColony].durability = colonies[targetColony].level * BASE_DURABILITY;

        colonies[my].enemy = targetColony;
        colonies[targetColony].enemy = my;

        emit WarDeclared(my, colonies[my].name, targetColony, colonies[targetColony].name, t);
    }


    function requestAlliance(address targetColony) external {
        address myColony = users[msg.sender].colony;
        require(myColony != address(0), "Not in colony");
        require(colonies[myColony].leader == msg.sender, "Only leader");
        require(colonies[targetColony].leader != address(0), "Invalid target");
        require(myColony != targetColony, "Cannot request self");
        require(!_isAllied(myColony, targetColony), "Already allied");
        require(!_isAtWar(myColony), "At war");

        bytes32 key = _getRequestKey(myColony, targetColony);
        require(!pendingAllianceRequests[key], "Already requested");

        pendingAllianceRequests[key] = true;

        emit AllianceRequested(myColony, colonies[myColony].name, targetColony, colonies[targetColony].name, block.timestamp);
    }

    function _declareAlliance(address targetColony) internal {
        address my = users[msg.sender].colony;
        require(my != address(0) && colonies[targetColony].leader != address(0) && my != targetColony);
        require(colonies[my].leader == msg.sender, "Only leader");
        require(!_isAllied(my, targetColony) && !_isAtWar(my));

        uint256 t = block.timestamp;
        allianceExpiry[my][targetColony] = t + ALLIANCE_DURATION;
        allianceExpiry[targetColony][my] = t + ALLIANCE_DURATION;

        emit AllianceDeclared(my, colonies[my].name, targetColony, colonies[targetColony].name, t + ALLIANCE_DURATION);
        emit AllianceDeclared(targetColony,colonies[targetColony].name, my, colonies[my].name, t + ALLIANCE_DURATION);
    }

    function acceptAlliance(address requestingColony) external {
        address myColony = users[msg.sender].colony;
        require(myColony != address(0), "Not in colony");
        require(colonies[myColony].leader == msg.sender, "Only leader");
        require(!_isAtWar(myColony), "Cannot accept during war");

        bytes32 key = _getRequestKey(requestingColony, myColony);
        require(pendingAllianceRequests[key], "No pending request from this colony");

        // 요청 확인됐으니 삭제 (재요청 가능하게)
        delete pendingAllianceRequests[key];

        // 기존 동맹 로직 재사용
        users[msg.sender].colony = myColony; // 리더 보장
        _declareAlliance(requestingColony);

        emit AllianceAccepted(requestingColony, colonies[requestingColony].name, myColony, colonies[myColony].name, block.timestamp + ALLIANCE_DURATION);
    }

    function cancelAllianceRequest(address targetColony) external {
        address myColony = users[msg.sender].colony;
        require(colonies[myColony].leader == msg.sender, "Only leader");

        bytes32 key = _getRequestKey(myColony, targetColony);
        if (pendingAllianceRequests[key]) {
            delete pendingAllianceRequests[key];
            emit AllianceRequestCancelled(myColony, colonies[myColony].name, targetColony, colonies[targetColony].name);
        }
    }

    function developColony() external {
        address colony = _requireInColonyAndCooldown();
        User storage developer = users[msg.sender];
        
        developer.experience += XP_EARNED_BY_ONCHAIN;
        colonies[colony].colonyExp += XP_EARNED_BY_ONCHAIN;
        
        colonies[colony].level = calculator.calculateColonyLevel(colonies[colony].colonyExp);

        developer.lastActionTime = block.timestamp;

        emit UserGetExpAndContribution(msg.sender, XP_EARNED_BY_ONCHAIN, 0);
        emit Developed(msg.sender, colony, XP_EARNED_BY_ONCHAIN);
        
    }

    function defend() external {
        address colony = _requireInColonyAndCooldown();
        require(_isAtWar(colony), "Colony is not at war.");

        User storage defender = users[msg.sender];
        
        uint256 defence = defender.level * defender.defense * 64;

        colonies[colony].durability += defence;

        defender.experience += XP_EARNED_BY_ONCHAIN;
        colonies[colony].colonyExp += XP_EARNED_BY_ONCHAIN;
        defender.contribution += defence;

        colonies[colony].level = calculator.calculateColonyLevel(colonies[colony].colonyExp);

        defender.lastActionTime = block.timestamp;

        emit Defended(msg.sender, colony, defence);
        emit UserGetExpAndContribution(msg.sender, XP_EARNED_BY_ONCHAIN, defence);
        emit DurabilityUpdated(colony, colonies[colony].durability);
    }

    function allianceDefend(address allyColony) external {
        address myColony = _requireInColonyAndCooldown();
        
        // 1. 동맹 관계 확인
        require(_isAllied(myColony, allyColony), "Not allied with this colony");
        
        // 2. allyColony가 전쟁 중이어야 함
        require(_isAtWar(allyColony), "Ally is not at war");

        User storage defender = users[msg.sender];
        uint256 defence = defender.level * defender.defense * 64;

        colonies[allyColony].durability += defence;

        // 보상
        defender.experience += XP_EARNED_BY_ONCHAIN;
        colonies[myColony].colonyExp += XP_EARNED_BY_ONCHAIN;
        // defender.contribution += defence;

        // 동맹국에도 기여 인정
        // colonies[allyColony].colonyExp += XP_EARNED_BY_ONCHAIN;

        // colonies[myColony].level = _calculateColonyLevel(colonies[myColony].colonyExp);
        // colonies[allyColony].level = _calculateColonyLevel(colonies[allyColony].colonyExp);

        colonies[myColony].level = calculator.calculateColonyLevel(colonies[myColony].colonyExp);
        colonies[allyColony].level = calculator.calculateColonyLevel(colonies[allyColony].colonyExp);

        defender.lastActionTime = block.timestamp;

        emit Defended(msg.sender, allyColony, defence);
        emit UserGetExpAndContribution(msg.sender, XP_EARNED_BY_ONCHAIN, defence);
        emit DurabilityUpdated(allyColony, colonies[allyColony].durability);
    }

    function attack(address targetColony) external {
        address myColony = _requireInColonyAndCooldown();
        require(_isAtWar(myColony) && !_isAllied(myColony, targetColony), "Colony is not at war.");
        require(colonies[myColony].enemy == targetColony, "Invalid enemy");

        User storage attacker = users[msg.sender];
        uint256 damage = attacker.level * attacker.attack * 64;

        Colony storage target = colonies[targetColony];
        if (target.durability < damage) {
            target.durability = 0;
        } else {
            target.durability -= damage;
            // _checkDefeated(myColony, targetColony);
            // Check Defeated
            if(colonies[targetColony].durability <= 0) {
                uint256 endTime = block.timestamp;
                endWarTime[myColony] = endTime;
                endWarTime[targetColony] = endTime;
                emit Defeated(myColony, colonies[myColony].name, targetColony, colonies[targetColony].name, endTime);
            }
        }

        attacker.experience += XP_EARNED_BY_ONCHAIN;
        colonies[myColony].colonyExp += XP_EARNED_BY_ONCHAIN;
        attacker.contribution += damage;

        colonies[myColony].level = calculator.calculateColonyLevel(colonies[myColony].colonyExp);

        attacker.lastActionTime = block.timestamp;

        emit Attacked(msg.sender, myColony, targetColony, damage);
        emit UserGetExpAndContribution(msg.sender, XP_EARNED_BY_ONCHAIN, 0);
        emit DurabilityUpdated(targetColony, target.durability);
    }

    function allianceAttack(address allyColony, address enemyColony) external {
        address myColony = _requireInColonyAndCooldown();
        
        // 1. 내가 속한 콜로니와 allyColony가 동맹이어야 함
        require(_isAllied(myColony, allyColony), "Not allied with this colony");
        
        // 2. allyColony가 enemyColony와 전쟁 중이어야 함
        require(_isAtWar(allyColony) && colonies[allyColony].enemy == enemyColony, "Ally not at war with target");

        User storage attacker = users[msg.sender];
        uint256 damage = attacker.level * attacker.attack * 64; // 동일한 공격력 공식

        Colony storage target = colonies[enemyColony];
        if (target.durability < damage) {
            target.durability = 0;
        } else {
            target.durability -= damage;
        }

        // 공격자 보상
        attacker.experience += XP_EARNED_BY_ONCHAIN;
        colonies[myColony].colonyExp += XP_EARNED_BY_ONCHAIN;
        // attacker.contribution += damage;

        // 동맹국에도 기여도로 인정 (중요!)
        // 동맹이 도와줬다는 걸 명확히 기록
        // if (users[msg.sender].colony != allyColony) {
        //     // 다른 콜로니 유저가 도와줬다면, allyColony의 colonyExp도 증가
        //     colonies[allyColony].colonyExp += XP_EARNED_BY_ONCHAIN;
        // }

        colonies[myColony].level = calculator.calculateColonyLevel(colonies[myColony].colonyExp);

        if (myColony != allyColony) {
            colonies[allyColony].level = calculator.calculateColonyLevel(colonies[allyColony].colonyExp);
        }

        attacker.lastActionTime = block.timestamp;

        emit Attacked(msg.sender, myColony, enemyColony, damage);
        emit UserGetExpAndContribution(msg.sender, XP_EARNED_BY_ONCHAIN, 0);
        emit DurabilityUpdated(enemyColony, target.durability);

        // 패배 체크
        if (target.durability == 0) {
            if(colonies[enemyColony].durability <= 0) {
                uint256 endTime = block.timestamp;
                endWarTime[allyColony] = endTime;
                endWarTime[enemyColony] = endTime;
                emit Defeated(allyColony, colonies[allyColony].name, enemyColony, colonies[enemyColony].name, endTime);
            }
        }
    }

    function addViralityAndChainExp(address user, uint256 amount) external onlyAuthorized {
        users[user].experience += amount;
    }

    function allocateStats(StatType statType, uint256 amount) external {

        require(amount > 0, "stat amount to allocate is upper than 0");

        User storage u = users[msg.sender];

        // enum 값에 따라 해당 스탯 증가
        if (statType == StatType.Attack) {
            u.attack += amount;
        } else if (statType == StatType.Defense) {
            u.defense += amount;
        } else if (statType == StatType.Virality) {
            u.virality += amount;
        } else if (statType == StatType.ChainPower) {
            u.chainPower += amount;
        }
        // enum 범위를 벗어나는 값이 들어올 경우 revert (컴파일 타임에 방지되지만 안전하게)
        else {
            revert("Invalid statType");
        }

        u.unallocatedPoints -= amount;

        emit StatsAllocated(msg.sender, statType, amount, u.unallocatedPoints);
    }
}