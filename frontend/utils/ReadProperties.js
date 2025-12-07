"use server";

import { getMyContract } from "./ContractHelper";
import { getWeb3Instance } from "./Web3Singleton";
import { cookies } from 'next/headers';
import { revalidatePath } from "next/cache";
import { GENESIS_CONTRACT_BLOCK } from "../lib/contractInfo";

const BASE_URL = 'https://insectarium-public-api.memex.xyz';

export async function handleItemClick() {
  revalidatePath('/game/', 'layout');
}

export async function getColonies() {
  // return await getMyContract().methods.colonies().call();
  const web3Obj = getWeb3Instance();
  
  const events = await getMyContract().getPastEvents('ColonyCreated', {
    fromBlock: web3Obj.utils.toHex(GENESIS_CONTRACT_BLOCK),
    toBlock: 'latest'
  });

  const colonyPromises = events.map(async (event, i) => {   
    const colonyLeader = event.returnValues.leader;
    const colonyAddr = event.returnValues.colony;
    const name = event.returnValues.name
    
    const colony = await getMyContract().methods.colonies(colonyAddr).call();
    const startWarTime = await getMyContract().methods.startWarTime(colonyAddr).call();
    const endWarTime = await getMyContract().methods.endWarTime(colonyAddr).call();

    return (
      {
        "id" : event.returnValues.colony,
        "leader" : colonyLeader,
        "name" :  name,
        "memberCnt" : colony.memberCount,
        "hp" : colony.durability,
        "level" : colony.level,
        "xp" : colony.colonyExp,
        "enemy" : colony.enemy,
        "startWarTime" : startWarTime,
        "endWarTime" : endWarTime,
      }
    )
  })

  const colonyList = await Promise.all(colonyPromises);
  return colonyList
}

export async function getColonyHistory(address) {
  
  const web3Obj = getWeb3Instance();

  let msgList = [];
  
  const fromWarDeclaredEvt = await getMyContract().getPastEvents('WarDeclared', {
    filter : {
      fromColony: address
    },
    fromBlock: web3Obj.utils.toHex(GENESIS_CONTRACT_BLOCK),
    toBlock: 'latest'
  });

  const toWarDeclaredEvt = await getMyContract().getPastEvents('WarDeclared', {
    filter : {
      toColony: address
    },
    fromBlock: web3Obj.utils.toHex(GENESIS_CONTRACT_BLOCK),
    toBlock: 'latest'
  });

  const fromAllianceDeclaredEvt = await getMyContract().getPastEvents('AllianceDeclared', {
    filter : {
      fromColony: address
    },
    fromBlock: web3Obj.utils.toHex(GENESIS_CONTRACT_BLOCK),
    toBlock: 'latest'
  });

  const toAllianceDeclaredEvt = await getMyContract().getPastEvents('AllianceDeclared', {
    filter : {
      toColony: address
    },
    fromBlock: web3Obj.utils.toHex(GENESIS_CONTRACT_BLOCK),
    toBlock: 'latest'
  });

  const fromDefeatedEvt = await getMyContract().getPastEvents('Defeated', {
    filter : {
      fromColony: address
    },
    fromBlock: web3Obj.utils.toHex(GENESIS_CONTRACT_BLOCK),
    toBlock: 'latest'
  });

  const toDefeatedEvt = await getMyContract().getPastEvents('Defeated', {
    filter : {
      toColony: address
    },
    fromBlock: web3Obj.utils.toHex(GENESIS_CONTRACT_BLOCK),
    toBlock: 'latest'
  });

  const fromWarDeclaredEvtProm = fromWarDeclaredEvt.map(async (event, i) => {
    const toColony = event.returnValues.toColony;
    const toName = event.returnValues.toName;
    const blockNumber = event.blockNumber;

    msgList.push({
      blockNumber : blockNumber,
      msg : `Declared War to ${toName}(${toColony})`
    });
  });

  const toWarDeclaredEvtProm = toWarDeclaredEvt.map(async (event, i) => {
    const fromColony = event.returnValues.fromColony;
    const fromName = event.returnValues.fromName;
    const blockNumber = event.blockNumber;

    msgList.push({
      blockNumber : blockNumber,
      msg : `${fromName}(${fromColony}) has declared war`
    });
  });

  const fromAllianceDeclaredEvtProm = fromAllianceDeclaredEvt.map(async (event, i) => {
    const fromColony = event.returnValues.fromColony;
    const fromName = event.returnValues.fromName;
    const blockNumber = event.blockNumber;

    msgList.push({
      blockNumber : blockNumber,
      msg : `${fromName}(${fromColony}) has formed an alliance.`
    });
  });

  const toAllianceDeclaredEvtProm = toAllianceDeclaredEvt.map(async (event, i) => {
    const fromColony = event.returnValues.fromColony;
    const fromName = event.returnValues.fromName;
    const blockNumber = event.blockNumber;

    msgList.push({
      blockNumber : blockNumber,
      msg : `We has formed an alliance with ${fromName}(${fromColony}).`
    });
  });

  const fromDefeatedEvtProm = fromDefeatedEvt.map(async (event, i) => {
    const attackColony = event.returnValues.attackColony;
    const attackColonyName = event.returnValues.attackColonyName;
    const blockNumber = event.blockNumber;
    const defeatedTime = event.returnValues.defeatedTime;

    msgList.push({
      blockNumber : blockNumber,
      msg : `We were defeted by ${attackColonyName}(${attackColony}) at ${Date(Number(defeatedTime) * 1000)}.`
    });
  });

  const toDefeatedEvtProm = toDefeatedEvt.map(async (event, i) => {
    const defeatedColony = event.returnValues.defeatedColony;
    const defeatedColonyName = event.returnValues.defeatedColonyName;
    const blockNumber = event.blockNumber;
    const defeatedTime = event.returnValues.defeatedTime;

    msgList.push({
      blockNumber : blockNumber,
      msg : `We defeted ${defeatedColonyName}(${defeatedColony}) at ${Date(Number(defeatedTime) * 1000)}.`
    });
  });
  
  await Promise.all(fromWarDeclaredEvtProm);
  await Promise.all(toWarDeclaredEvtProm);
  await Promise.all(fromAllianceDeclaredEvtProm);
  await Promise.all(toAllianceDeclaredEvtProm);
  await Promise.all(fromDefeatedEvtProm);
  await Promise.all(toDefeatedEvtProm);

  const sortedData = msgList.sort((a, b) => {
    if (b.blockNumber > a.blockNumber) {
      return 1;
    }
    if (b.blockNumber < a.blockNumber) {
      return -1;
    }
    return 0;
  });

  return sortedData;
}

export async function fetchMyInfo() {
  const cookieStore = await cookies();
  const authObj = JSON.parse(cookieStore.get('auth')?.value);

  try {
        // 유저 정보를 일단 받고
        const userResult = await getMyContract().methods.users(authObj.address).call();

        // 받은 유저 정보 기반으로 콜로니 정보를 받는다.
        const colonyResult = await getMyContract().methods.colonies(userResult.colony)?.call();

        const startWarTime = await getMyContract().methods.startWarTime(colonyResult.memeCoin).call();
        const endWarTime = await getMyContract().methods.endWarTime(colonyResult.memeCoin).call();

        return {
          userInfo: {
            "walletAddr" : authObj.address,
            "attack" : userResult.attack,
            "chainPower" : userResult.chainPower,
            "colony" : colonyResult?.name,
            "colonyAddr" : colonyResult?.memeCoin,
            "contribution" : userResult.contribution,
            "defense" : userResult.defense,
            "experience" : userResult.experience,
            "lastActionTime" : userResult.lastActionTime,
            "level" : userResult.level,
            "unallocatedPoints": userResult.unallocatedPoints,
            "virality" : userResult.virality,
            "warStartTime" : startWarTime,
            "warEndTime" : endWarTime,
            "isLeader" : authObj.address.toLowerCase() == colonyResult.leader.toLowerCase() ? true : false,
          },
          colonyInfo: colonyResult
        };
               
      } catch (error) {
        console.error("Error fetching data from contract:", error);
        // setIsLoading(false);
  }
}


export async function getFeeds() {
  
  const res = await fetch(BASE_URL + "/public/v1/post/feed");
  
  // 에러 처리를 추가하여 응답이 성공적인지 확인합니다.
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  
  return await res.json();
}

export async function getUsersInfo() {
  const res = await fetch(BASE_URL + "/public/v1/memekathon/mock-user-data");

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  
  return await res.json();
}

export async function getUserInfo(username, usernametag) {
  const header = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiVmVzdGEuQ3JvbmE3OEBnbWFpbC5jb20iLCJ1c2VyTmFtZSI6InpJZmpwaWNBTnIiLCJ1c2VyTmFtZVRhZyI6bnVsbCwicmVnaXN0ZXJTdGF0ZSI6IlBFTkRJTkciLCJpYXQiOjE3NjM3MDIxNDcsImV4cCI6MTc3MjM0MjE0N30.S6TA_lGyJ7oS6mq_GD2BMTkYSF14-h5dJfp2c2uUGEw'
  }
  const res = await fetch(BASE_URL + `/public/v1/user/${username}/${usernametag}`,
    {

      headers : header
    }
  );
  
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const data = await res.json();
  
  return data;
}