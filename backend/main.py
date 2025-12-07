from web3 import Web3
import json
from ref.ContractInfo import *
from dotenv import load_dotenv
import os
import traceback

# 환경변수 로드
load_dotenv()

PRIVATE_KEY = os.getenv('DEPLOYER_KEY')

# 함수 호출 파라미터
TARGET_USER_ADDRESS = 'TARGET_USER_ADDRESS'
AMOUNT_TO_ADD = 100

# 유저별 소셜 활동, 온체인 활동 집계로직 구현 시 집계 후 해당 함수를 실행할 예정임
def send_add_virality_txn(userAddr, amount):
    # 1. web3 인스턴스 및 계정 설정
    try:
        w3 = Web3(Web3.HTTPProvider(RPC_URL))
        if not w3.is_connected():
            return
            
        # 개인 키에서 계정 주소 추출
        account = w3.eth.account.from_key(PRIVATE_KEY)
        sender_address = account.address

    except Exception as e:
        print(f"web3 초기화 중 오류 발생: {e}")
        return

    # 2. 컨트랙트 인스턴스 생성
    contract = w3.eth.contract(address=w3.to_checksum_address(CONTRACT_ADDRESS), abi=CONTRACT_ABI)
    
    # 3. 트랜잭션 빌드
    try:
        # 논스(nonce) 가져오기
        nonce = w3.eth.get_transaction_count(sender_address)
        
        # 가스 가격 (EIP-1559가 아닌 경우)
        gas_price = w3.eth.gas_price 
        
        # 트랜잭션 데이터 생성
        txn_template = contract.functions.addViralityAndChainExp(
            w3.to_checksum_address(userAddr), 
            amount
        ).build_transaction({
            'chainId': w3.eth.chain_id,
            'from': sender_address,
            'nonce': nonce,
            # 'gas': 200000, # 가스 필드를 임시로 제거
            'gasPrice': gas_price
        })

    except Exception as e:
        print(f"Transaction Build Error")
        traceback.print_exc()
        return
    
    try:
        estimated_gas = w3.eth.estimate_gas(txn_template)
        gas_limit = int(estimated_gas * 1.2) 
        print(f"예상 가스 소모량: {estimated_gas} (Safe Limit: {gas_limit})")
    
    except Exception as e:
        traceback.print_exc()
        return
    
    final_txn = {
        **txn_template,
        'gas': gas_limit # 추정된 가스 한도를 적용
    }

    # 4. 트랜잭션 서명 및 전송
    try:
        # 트랜잭션 서명
        signed_txn = w3.eth.account.sign_transaction(final_txn, private_key=PRIVATE_KEY)
        
        # 트랜잭션 전송
        tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
        print(f"Hash: {w3.to_hex(tx_hash)}")

        # 5. 트랜잭션 처리 대기
        tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

        # 6. 결과 확인
        if tx_receipt.status == 1:
            print("🎉 스마트 컨트랙트 함수 호출 성공!")
            print(f"Block Number : {tx_receipt.blockNumber}, used gas: {tx_receipt.gasUsed}")
        else:
            print("스마트 컨트랙트 함수 호출 실패 (Revert).")
            
    except Exception as e:
        print(f"트랜잭션 전송 또는 확인 중 오류")
        traceback.print_exc()


# --- 4. 메인 실행 ---
if __name__ == "__main__":
    send_add_virality_txn("0x26a99cba33f1f2e685375b70ab30c22ad650d63f", 800)