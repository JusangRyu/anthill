RPC_URL = "https://rpc.insectarium.memecore.net"
CONTRACT_ADDRESS = "0xd8A69B75771423b6721E50F1BE312F87423834CD"
CONTRACT_ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_memeFactory",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": True,
                "internalType": "address",
                "name": "fromColony",
                "type": "address"
            },
            {
                "indexed": False,
                "internalType": "string",
                "name": "fromName",
                "type": "string"
            },
            {
                "indexed": True,
                "internalType": "address",
                "name": "toColony",
                "type": "address"
            },
            {
                "indexed": False,
                "internalType": "string",
                "name": "toName",
                "type": "string"
            },
            {
                "indexed": False,
                "internalType": "uint256",
                "name": "endsAt",
                "type": "uint256"
            }
        ],
        "name": "AllianceAccepted",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": True,
                "internalType": "address",
                "name": "fromColony",
                "type": "address"
            },
            {
                "indexed": False,
                "internalType": "string",
                "name": "fromName",
                "type": "string"
            },
            {
                "indexed": True,
                "internalType": "address",
                "name": "toColony",
                "type": "address"
            },
            {
                "indexed": False,
                "internalType": "string",
                "name": "toName",
                "type": "string"
            },
            {
                "indexed": False,
                "internalType": "uint256",
                "name": "endsAt",
                "type": "uint256"
            }
        ],
        "name": "AllianceDeclared",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": True,
                "internalType": "address",
                "name": "fromColony",
                "type": "address"
            },
            {
                "indexed": False,
                "internalType": "string",
                "name": "fromName",
                "type": "string"
            },
            {
                "indexed": True,
                "internalType": "address",
                "name": "toColony",
                "type": "address"
            },
            {
                "indexed": False,
                "internalType": "string",
                "name": "toName",
                "type": "string"
            }
        ],
        "name": "AllianceRequestCancelled",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": True,
                "internalType": "address",
                "name": "fromColony",
                "type": "address"
            },
            {
                "indexed": False,
                "internalType": "string",
                "name": "fromName",
                "type": "string"
            },
            {
                "indexed": True,
                "internalType": "address",
                "name": "toColony",
                "type": "address"
            },
            {
                "indexed": False,
                "internalType": "string",
                "name": "toName",
                "type": "string"
            },
            {
                "indexed": False,
                "internalType": "uint256",
                "name": "endsAt",
                "type": "uint256"
            }
        ],
        "name": "AllianceRequested",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": True,
                "internalType": "address",
                "name": "attacker",
                "type": "address"
            },
            {
                "indexed": True,
                "internalType": "address",
                "name": "fromColony",
                "type": "address"
            },
            {
                "indexed": True,
                "internalType": "address",
                "name": "toColony",
                "type": "address"
            },
            {
                "indexed": False,
                "internalType": "uint256",
                "name": "damage",
                "type": "uint256"
            }
        ],
        "name": "Attacked",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": True,
                "internalType": "address",
                "name": "leader",
                "type": "address"
            },
            {
                "indexed": True,
                "internalType": "address",
                "name": "colony",
                "type": "address"
            },
            {
                "indexed": False,
                "internalType": "string",
                "name": "name",
                "type": "string"
            }
        ],
        "name": "ColonyCreated",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": True,
                "internalType": "address",
                "name": "attackColony",
                "type": "address"
            },
            {
                "indexed": False,
                "internalType": "string",
                "name": "attackColonyName",
                "type": "string"
            },
            {
                "indexed": True,
                "internalType": "address",
                "name": "defeatedColony",
                "type": "address"
            },
            {
                "indexed": False,
                "internalType": "string",
                "name": "defeatedColonyName",
                "type": "string"
            },
            {
                "indexed": False,
                "internalType": "uint256",
                "name": "defeatedTime",
                "type": "uint256"
            }
        ],
        "name": "Defeated",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": True,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": True,
                "internalType": "address",
                "name": "colony",
                "type": "address"
            },
            {
                "indexed": False,
                "internalType": "uint256",
                "name": "defence",
                "type": "uint256"
            }
        ],
        "name": "Defended",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": True,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": True,
                "internalType": "address",
                "name": "colony",
                "type": "address"
            },
            {
                "indexed": False,
                "internalType": "uint256",
                "name": "development",
                "type": "uint256"
            }
        ],
        "name": "Developed",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": True,
                "internalType": "address",
                "name": "colony",
                "type": "address"
            },
            {
                "indexed": False,
                "internalType": "uint256",
                "name": "newDurability",
                "type": "uint256"
            }
        ],
        "name": "DurabilityUpdated",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": True,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": True,
                "internalType": "address",
                "name": "colony",
                "type": "address"
            }
        ],
        "name": "JoinedColony",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": True,
                "internalType": "address",
                "name": "colony",
                "type": "address"
            },
            {
                "indexed": True,
                "internalType": "address",
                "name": "oldLeader",
                "type": "address"
            },
            {
                "indexed": True,
                "internalType": "address",
                "name": "newLeader",
                "type": "address"
            }
        ],
        "name": "LeadershipTransferred",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": True,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": True,
                "internalType": "address",
                "name": "colony",
                "type": "address"
            }
        ],
        "name": "LeftColony",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": True,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": False,
                "internalType": "uint256",
                "name": "updatedLevel",
                "type": "uint256"
            },
            {
                "indexed": False,
                "internalType": "uint256",
                "name": "unallocatedPoints",
                "type": "uint256"
            }
        ],
        "name": "LevelUpdated",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": True,
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "Login",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": True,
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "Registered",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": True,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": False,
                "internalType": "enum Anthill.StatType",
                "name": "statType",
                "type": "uint8"
            },
            {
                "indexed": False,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": False,
                "internalType": "uint256",
                "name": "unallocatedPoints",
                "type": "uint256"
            }
        ],
        "name": "StatsAllocated",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": True,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": False,
                "internalType": "uint256",
                "name": "expAmount",
                "type": "uint256"
            },
            {
                "indexed": False,
                "internalType": "uint256",
                "name": "contributionAmount",
                "type": "uint256"
            }
        ],
        "name": "UserGetExpAndContribution",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": True,
                "internalType": "address",
                "name": "fromColony",
                "type": "address"
            },
            {
                "indexed": False,
                "internalType": "string",
                "name": "fromName",
                "type": "string"
            },
            {
                "indexed": True,
                "internalType": "address",
                "name": "toColony",
                "type": "address"
            },
            {
                "indexed": False,
                "internalType": "string",
                "name": "toName",
                "type": "string"
            },
            {
                "indexed": False,
                "internalType": "uint256",
                "name": "endsAt",
                "type": "uint256"
            }
        ],
        "name": "WarDeclared",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "ACTION_COOLDOWN",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "ALLIANCE_DURATION",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "BASE_DURABILITY",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "COLONY_CREATION_FEE",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "WAR_DURATION",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "XP_EARNED_BY_ONCHAIN",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "requestingColony",
                "type": "address"
            }
        ],
        "name": "acceptAlliance",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "addViralityAndChainExp",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "allyColony",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "enemyColony",
                "type": "address"
            }
        ],
        "name": "allianceAttack",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "allyColony",
                "type": "address"
            }
        ],
        "name": "allianceDefend",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "allianceExpiry",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "enum Anthill.StatType",
                "name": "statType",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "allocateStats",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "targetColony",
                "type": "address"
            }
        ],
        "name": "attack",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "authorizedExpDistributor",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "calculator",
        "outputs": [
            {
                "internalType": "contract IColonyLevelCalculator",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "targetColony",
                "type": "address"
            }
        ],
        "name": "cancelAllianceRequest",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "colonies",
        "outputs": [
            {
                "internalType": "address",
                "name": "leader",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "level",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "colonyExp",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "memeCoin",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "durability",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "enemy",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "memberCount",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "colonyLevelCalculator",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            }
        ],
        "name": "createColony",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "targetColony",
                "type": "address"
            }
        ],
        "name": "declareWar",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "defend",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "developColony",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "endWarTime",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "colony",
                "type": "address"
            }
        ],
        "name": "joinColony",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "leaveColony",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "memeFactory",
        "outputs": [
            {
                "internalType": "contract IMemeCoinFactory",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "pendingAllianceRequests",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "register",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "targetColony",
                "type": "address"
            }
        ],
        "name": "requestAlliance",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "startWarTime",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newLeader",
                "type": "address"
            }
        ],
        "name": "transferLeadership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "updatedLevel",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "exp",
                "type": "uint256"
            }
        ],
        "name": "updateUserLevel",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "users",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "level",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "experience",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "contribution",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "colony",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "lastActionTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "attack",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "defense",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "virality",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "chainPower",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "unallocatedPoints",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "warDeclaredAt",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]