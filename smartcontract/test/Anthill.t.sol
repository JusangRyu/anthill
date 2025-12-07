// test/Anthill.t.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/Anthill.sol";
import "../src/AnthillMemeCoinFactory.sol";

contract AnthillTest is Test {
    Anthill public anthill;

    address colonyAlice;
    address colonyBob;
    address owner = address(0x1);
    address alice = address(0xA1);
    address bob   = address(0xB2);
    address carol = address(0xC3);

    address factory = address(0x5252);
    address fakeMemeCoin = address(0x5e);
    address fakeMemeCoinSecond = address(0x55);
    address fakeMemeCoinThird = address(0x52);

    function setUp() public {
        vm.label(owner, 'owner');
        vm.label(alice, 'alice');
        vm.label(bob, 'bob');
        vm.label(carol, 'carol');
        
        vm.startPrank(owner);
        
        anthill = new Anthill(factory);
        
        vm.stopPrank();

        _userSetup();
    }

    function _userSetup() internal {
        // 엘리스싀작
        vm.prank(alice);

        // 가입
        anthill.register();
        
        //가입여부 체크
        anthill.register();        

        // 밥 시작
        vm.prank(bob);
        anthill.register();
        
        // 밥 시작
        vm.prank(carol);
        anthill.register();

        deal(alice, 100 ether);
        deal(bob, 100 ether);
        deal(carol, 100 ether);
        assertEq(alice.balance, 100 ether);
        assertEq(bob.balance, 100 ether);
        assertEq(carol.balance, 100 ether);
    }

    function testCreateColony() public {
        vm.prank(alice);
        assertEq(alice.balance, 100 ether);
        address factoryAddress = address(0x0000000000000000000000000000000000005252);
        vm.mockCall(
            factoryAddress,  // 모킹할 주소
            abi.encodeWithSelector(
                IMemeCoinFactory.createMemeCoin.selector,  // 함수 셀렉터
                "oe empire",  // 첫 번째 인자 (이름)
                alice  // 두 번째 인자 (소유자)
            ),
            abi.encode(fakeMemeCoin)
        );

        anthill.createColony{value: 10 ether}("oe empire");
    }

    /* 소속이 있는 상태에서 콜로니 생성시 문제 발생 재현
    function testCreateColonyAndRegisterColonyDuplicate() public {
        address factoryAddress = address(0x0000000000000000000000000000000000005252);
        vm.mockCall(
            factoryAddress,  // 모킹할 주소
            abi.encodeWithSelector(
                IMemeCoinFactory.createMemeCoin.selector,  // 함수 셀렉터
                "oe empire",  // 첫 번째 인자 (이름)
                alice  // 두 번째 인자 (소유자)
            ),
            abi.encode(fakeMemeCoin)
        );

        vm.prank(alice);

        anthill.createColony("oe empire");

        vm.mockCall(
            factoryAddress,  // 모킹할 주소
            abi.encodeWithSelector(
                IMemeCoinFactory.createMemeCoin.selector,  // 함수 셀렉터
                "game stop",  // 첫 번째 인자 (이름)
                bob  // 두 번째 인자 (소유자)
            ),
            abi.encode(fakeMemeCoinSecond)
        );

        anthill.createColony("game stop");
    }
    */

    // 콜로니 가입
    function testCreateColonyAndRegisterColony() public {
        address factoryAddress = address(0x0000000000000000000000000000000000005252);
        vm.mockCall(
            factoryAddress,  // 모킹할 주소
            abi.encodeWithSelector(
                IMemeCoinFactory.createMemeCoin.selector,  // 함수 셀렉터
                "oe empire",  // 첫 번째 인자 (이름)
                alice  // 두 번째 인자 (소유자)
            ),
            abi.encode(fakeMemeCoin)  // 반환값: void라면 빈 바이트. 만약 주소나 값을 반환하면 abi.encode(가짜값)으로 설정
        );

        vm.prank(alice);

        assertEq(alice.balance, 100 ether);
        anthill.createColony{value: 10 ether}("oe empire");

        vm.prank(bob);

        anthill.joinColony(fakeMemeCoin);
    }

    // 콜로니 탈퇴
    function testCreateColonyAndLeaveColony() public {
        address factoryAddress = address(0x0000000000000000000000000000000000005252);
        vm.mockCall(
            factoryAddress,  // 모킹할 주소
            abi.encodeWithSelector(
                IMemeCoinFactory.createMemeCoin.selector,  // 함수 셀렉터
                "oe empire",  // 첫 번째 인자 (이름)
                alice  // 두 번째 인자 (소유자)
            ),
            abi.encode(fakeMemeCoin)  // 반환값: void라면 빈 바이트. 만약 주소나 값을 반환하면 abi.encode(가짜값)으로 설정
        );

        vm.prank(alice);
        assertEq(alice.balance, 100 ether);
        anthill.createColony{value: 10 ether}("oe empire");

        vm.prank(bob);

        anthill.joinColony(fakeMemeCoin);

        vm.prank(carol);

        anthill.joinColony(fakeMemeCoin);

        vm.prank(bob);

        anthill.leaveColony();
    }

    function testTransferLeader() public {
        address factoryAddress = address(0x0000000000000000000000000000000000005252);
        vm.mockCall(
            factoryAddress,  // 모킹할 주소
            abi.encodeWithSelector(
                IMemeCoinFactory.createMemeCoin.selector,  // 함수 셀렉터
                "oe empire",  // 첫 번째 인자 (이름)
                alice  // 두 번째 인자 (소유자)
            ),
            abi.encode(fakeMemeCoin)  // 반환값: void라면 빈 바이트. 만약 주소나 값을 반환하면 abi.encode(가짜값)으로 설정
        );

        vm.prank(alice);
        assertEq(alice.balance, 100 ether);
        anthill.createColony{value: 10 ether}("oe empire");

        vm.prank(bob);

        anthill.joinColony(fakeMemeCoin);

        vm.prank(carol);

        anthill.joinColony(fakeMemeCoin);

        vm.prank(alice);

        anthill.transferLeadership(bob);

    }

    function testDeclareWar() public {
        address factoryAddress = address(0x0000000000000000000000000000000000005252);
        vm.mockCall(
            factoryAddress,  // 모킹할 주소
            abi.encodeWithSelector(
                IMemeCoinFactory.createMemeCoin.selector,  // 함수 셀렉터
                "oe empire",  // 첫 번째 인자 (이름)
                alice  // 두 번째 인자 (소유자)
            ),
            abi.encode(fakeMemeCoin)  // 반환값: void라면 빈 바이트. 만약 주소나 값을 반환하면 abi.encode(가짜값)으로 설정
        );

        vm.prank(alice);
        assertEq(alice.balance, 100 ether);
        anthill.createColony{value: 10 ether}("oe empire");


        vm.mockCall(
            factoryAddress,  // 모킹할 주소
            abi.encodeWithSelector(
                IMemeCoinFactory.createMemeCoin.selector,  // 함수 셀렉터
                "bob empire",  // 첫 번째 인자 (이름)
                bob  // 두 번째 인자 (소유자)
            ),
            abi.encode(fakeMemeCoinSecond)  // 반환값: void라면 빈 바이트. 만약 주소나 값을 반환하면 abi.encode(가짜값)으로 설정
        );

        vm.prank(bob);
        assertEq(bob.balance, 100 ether);
        anthill.createColony{value: 10 ether}("bob empire");

        vm.prank(carol);

        anthill.joinColony(fakeMemeCoin);
        

        vm.prank(alice);

        anthill.declareWar(fakeMemeCoinSecond);

        

    }

    function testDeclareAlliance() public {
        address factoryAddress = address(0x0000000000000000000000000000000000005252);
        vm.mockCall(
            factoryAddress,  // 모킹할 주소
            abi.encodeWithSelector(
                IMemeCoinFactory.createMemeCoin.selector,  // 함수 셀렉터
                "oe empire",  // 첫 번째 인자 (이름)
                alice  // 두 번째 인자 (소유자)
            ),
            abi.encode(fakeMemeCoin)  // 반환값: void라면 빈 바이트. 만약 주소나 값을 반환하면 abi.encode(가짜값)으로 설정
        );

        vm.prank(alice);
        assertEq(alice.balance, 100 ether);
        anthill.createColony{value: 10 ether}("oe empire");


        vm.mockCall(
            factoryAddress,  // 모킹할 주소
            abi.encodeWithSelector(
                IMemeCoinFactory.createMemeCoin.selector,  // 함수 셀렉터
                "bob empire",  // 첫 번째 인자 (이름)
                bob  // 두 번째 인자 (소유자)
            ),
            abi.encode(fakeMemeCoinSecond)  // 반환값: void라면 빈 바이트. 만약 주소나 값을 반환하면 abi.encode(가짜값)으로 설정
        );

        vm.prank(bob);
        assertEq(bob.balance, 100 ether);
        anthill.createColony{value: 10 ether}("bob empire");

        vm.prank(carol);

        anthill.joinColony(fakeMemeCoin);
        

        vm.prank(alice);

        anthill.requestAlliance(fakeMemeCoinSecond);

        vm.prank(bob);

        anthill.acceptAlliance(fakeMemeCoin);
    }

    function testAttack() public {
        address factoryAddress = address(0x0000000000000000000000000000000000005252);
        vm.mockCall(
            factoryAddress,  // 모킹할 주소
            abi.encodeWithSelector(
                IMemeCoinFactory.createMemeCoin.selector,  // 함수 셀렉터
                "oe empire",  // 첫 번째 인자 (이름)
                alice  // 두 번째 인자 (소유자)
            ),
            abi.encode(fakeMemeCoin)  // 반환값: void라면 빈 바이트. 만약 주소나 값을 반환하면 abi.encode(가짜값)으로 설정
        );

        vm.prank(alice);
        assertEq(alice.balance, 100 ether);
        anthill.createColony{value: 10 ether}("oe empire");
        vm.stopPrank();

        vm.mockCall(
            factoryAddress,  // 모킹할 주소
            abi.encodeWithSelector(
                IMemeCoinFactory.createMemeCoin.selector,  // 함수 셀렉터
                "bob empire",  // 첫 번째 인자 (이름)
                bob  // 두 번째 인자 (소유자)
            ),
            abi.encode(fakeMemeCoinSecond)  // 반환값: void라면 빈 바이트. 만약 주소나 값을 반환하면 abi.encode(가짜값)으로 설정
        );

        vm.startPrank(bob);
        assertEq(bob.balance, 100 ether);
        anthill.createColony{value: 10 ether}("bob empire");
        vm.stopPrank();

        vm.startPrank(carol);

        anthill.joinColony(fakeMemeCoin);
        
        vm.stopPrank();

        vm.startPrank(alice);

        anthill.declareWar(fakeMemeCoinSecond);

        vm.warp(3 hours);
        anthill.attack(fakeMemeCoinSecond);

    }

    function testDefend() public {
        address factoryAddress = address(0x0000000000000000000000000000000000005252);
        vm.mockCall(
            factoryAddress,  // 모킹할 주소
            abi.encodeWithSelector(
                IMemeCoinFactory.createMemeCoin.selector,  // 함수 셀렉터
                "oe empire",  // 첫 번째 인자 (이름)
                alice  // 두 번째 인자 (소유자)
            ),
            abi.encode(fakeMemeCoin)  // 반환값: void라면 빈 바이트. 만약 주소나 값을 반환하면 abi.encode(가짜값)으로 설정
        );

        vm.prank(alice);
        assertEq(alice.balance, 100 ether);
        anthill.createColony{value: 10 ether}("oe empire");
        vm.stopPrank();

        vm.mockCall(
            factoryAddress,  // 모킹할 주소
            abi.encodeWithSelector(
                IMemeCoinFactory.createMemeCoin.selector,  // 함수 셀렉터
                "bob empire",  // 첫 번째 인자 (이름)
                bob  // 두 번째 인자 (소유자)
            ),
            abi.encode(fakeMemeCoinSecond)  // 반환값: void라면 빈 바이트. 만약 주소나 값을 반환하면 abi.encode(가짜값)으로 설정
        );

        vm.startPrank(bob);
        assertEq(bob.balance, 100 ether);
        anthill.createColony{value: 10 ether}("bob empire");
        vm.stopPrank();

        vm.startPrank(carol);

        anthill.joinColony(fakeMemeCoin);
        
        vm.stopPrank();

        vm.startPrank(alice);

        anthill.declareWar(fakeMemeCoinSecond);

        vm.warp(3 hours);
        anthill.attack(fakeMemeCoinSecond);

        vm.stopPrank();

        vm.startPrank(bob);
        anthill.defend();

    }

    function testAllianceAttack() public {
        address factoryAddress = address(0x0000000000000000000000000000000000005252);
        vm.mockCall(
            factoryAddress,  // 모킹할 주소
            abi.encodeWithSelector(
                IMemeCoinFactory.createMemeCoin.selector,  // 함수 셀렉터
                "oe empire",  // 첫 번째 인자 (이름)
                alice  // 두 번째 인자 (소유자)
            ),
            abi.encode(fakeMemeCoin)  // 반환값: void라면 빈 바이트. 만약 주소나 값을 반환하면 abi.encode(가짜값)으로 설정
        );

        vm.prank(alice);
        assertEq(alice.balance, 100 ether);
        anthill.createColony{value: 10 ether}("oe empire");
        vm.stopPrank();

        vm.mockCall(
            factoryAddress,  // 모킹할 주소
            abi.encodeWithSelector(
                IMemeCoinFactory.createMemeCoin.selector,  // 함수 셀렉터
                "bob empire",  // 첫 번째 인자 (이름)
                bob  // 두 번째 인자 (소유자)
            ),
            abi.encode(fakeMemeCoinSecond)  // 반환값: void라면 빈 바이트. 만약 주소나 값을 반환하면 abi.encode(가짜값)으로 설정
        );

        vm.startPrank(bob);
        assertEq(bob.balance, 100 ether);
        anthill.createColony{value: 10 ether}("bob empire");
        vm.stopPrank();

        vm.mockCall(
            factoryAddress,  // 모킹할 주소
            abi.encodeWithSelector(
                IMemeCoinFactory.createMemeCoin.selector,  // 함수 셀렉터
                "carol empire",  // 첫 번째 인자 (이름)
                carol  // 두 번째 인자 (소유자)
            ),
            abi.encode(fakeMemeCoinThird)  // 반환값: void라면 빈 바이트. 만약 주소나 값을 반환하면 abi.encode(가짜값)으로 설정
        );

        vm.startPrank(carol);

        anthill.createColony{value: 10 ether}("carol empire");
        anthill.requestAlliance(fakeMemeCoin);
        
        vm.stopPrank();

        vm.startPrank(alice);
        anthill.acceptAlliance(fakeMemeCoinThird);

        vm.warp(1 hours);

        anthill.declareWar(fakeMemeCoinSecond);

        vm.warp(3 hours);
        anthill.attack(fakeMemeCoinSecond);

        vm.stopPrank();

        vm.startPrank(carol);
        anthill.allianceAttack(fakeMemeCoin, fakeMemeCoinSecond);
        vm.stopPrank();

        vm.startPrank(bob);
        anthill.defend();

    }


}