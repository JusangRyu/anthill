"use client"

import { useEffect, useState } from "react"
import { Search, Users, Shield, Swords, Plus, X, Heart } from "lucide-react"
import { handleItemClick, getColonies } from "../../../utils/ReadProperties"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../../../lib/contractInfo"
import { NULL_DATA } from "../../../lib/contractInfo"
import Web3 from "web3"
import { useLoading } from "../../../context/LoadingContext"
import { useUser } from "../../../context/UserContext"
import { getMyContract } from "../../../utils/ContractHelper"

export default function ColoniesPage() {
    const [hasColony, setHasColony] = useState(false);
    const [isLeader, setIsLeader] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [coloniesList, setColoniesList] = useState([]);
    const [myColonyAddr, setMyColonyAddr] = useState(0);
    const {setIsLoading} = useLoading();

    const {userData, colonyData, isDataLoading, refreshData} = useUser();
    
    useEffect(() => {

      if (!userData || !colonyData || isDataLoading) {
        return; 
      }
      
      setIsLeader(userData.isLeader);
      setMyColonyAddr(userData.colonyAddr)
      setHasColony((userData?.colonyAddr !== NULL_DATA && userData?.colonyAddr !== "" && 
              userData?.colonyAddr !== undefined) ? false : true
          );

      const fetchColoniesData = async () => {
          setIsLoading(true);
          
          const colonies = await getColonies();
          setColoniesList(colonies);

          setIsLoading(false);
      }
      
      fetchColoniesData();
    }, [userData, colonyData]);


    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
            <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Colonies</h1>
                {
                    hasColony && 
                    <p className="text-gray-600">Select colony to join.</p>
                }
                
            </div>
            
            <div className="flex items-center gap-4">
            
                {
                    hasColony &&
                    <button 
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700 transition-colors font-semibold text-sm shadow-md hover:shadow-lg"
                    >
                        <Plus className="w-5 h-5" />
                        Create Colony
                    </button>
                }
            
            
            {/* Search */}
            <div className="relative">
                <input
                type="text"
                placeholder="Search Colonies..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-sm w-80 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
            <FilterChip label="All" active />
            <FilterChip label="Truce" />
            <FilterChip label="At War" />
        </div>

        {/* Colonies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {
            coloniesList.map((colony) => (
                <ColonyCard key={colony.id} {...colony} myColony={myColonyAddr} isLeader={isLeader} hasColony={myColonyAddr != NULL_DATA}/>
              ))
            }
        </div>

        {/* Create Colony Modal */}
        {showCreateModal && (
            <CreateColonyModal 
            onClose={() => setShowCreateModal(false)}
            onCreateColony={(newColony) => {
                setColoniesList([newColony, ...coloniesList])
                setShowCreateModal(false)
            }}
            />
        )}
        </div>
    )
}

function FilterChip({ label, active = false }) {
  return (
    <button
      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
        active
          ? "bg-purple-400 text-white"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
    >
      {label}
    </button>
  )
}

function CreateColonyModal({ onClose, onCreateColony }) {
  const {userData, colonyData, isDataLoading, refreshData} = useUser();
  const [formData, setFormData] = useState({
    name: "",
    leader: "",
    description: "",
    image: "🏛️",
    imageType: "icon" // "icon" or "upload"
  })

  const {isLoading, setIsLoading} = useLoading();

  const handleCreateColony = async (name) => {
        if (!window.ethereum) {
          alert("You need to install Metamask or other Web3 Wallet.");
          return;
        }
        
        const myColonyInfo = colonyData;

        if(myColonyInfo?.memeCoin != undefined && myColonyInfo?.memeCoin != NULL_DATA)
        {
            alert("You already in a colony.");
            return;
        }
        
        setIsLoading(true);
        
        try {
          // 1. 계정 연결 요청 (이미 연결돼 있으면 바로 통과)
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          const userAddress = accounts[0];
    
          const web3 = new Web3(window.ethereum);
          const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    
          // 2. 공격 트랜잭션 전송
          const tx = await contract.methods.createColony(name).send({
            from: userAddress,
            value : web3.utils.toWei("10", "ether"),
          });
          
          alert("Your Colony is created!" + "\nTransaction : " + tx.transactionHash);

          await handleItemClick();

          window.location.reload();
          
          const newColony = {
            id: Date.now(),
            name: formData.name,
            leader: formData.leader,
            members: 1,
            maxMembers: 100,
            level: 1,
            status: "Peaceful",
            xp: 0,
            description: formData.description,
            icon: formData.image,
            imageType: formData.imageType
          }

          // onCreateColony(newColony);
    
        } catch (error) {
          console.error(error);
    
          if (error.code === 4001) {
            alert("A Transaction is rejected.");
          } else if (error.message.includes("Coiony is not at war")) {
            alert("Your Colony is not at war");
          } else if (error.message.includes("Invalid enemy")) {
            alert("Invalid enemy");
          } else if (error.message.includes("cooldown")) {
            alert("You are Cooldown.");
          } else {
            alert("failed to attack : " + (error.message || "Unknown Error"));
          }
        } finally {
          setIsLoading(false);
          await refreshData();
        }
    };

  const handleSubmit = (e) => {
    e.preventDefault()
    handleCreateColony(formData.name);
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">Create New Colony</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              Colony Name *
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Your Colony Name. Crik-crik🦗"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
            >
              Create Colony
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ColonyCard({ id, name, leader, memberCnt, level, hp, enemy, startWarTime, endWarTime, xp, myColony, hasColony, isLeader}) {
  const {userData, colonyData, isDataLoading, refreshData} = useUser();
  const isAtWar = (enemy !== NULL_DATA && Date.now() <= Number(endWarTime) * 1000);
  const {setIsLoading} = useLoading();
  const [enemyName, setEnemyName] = useState(NULL_DATA);

  useEffect(()=> {
    async function fetchEnemyName(enemy) {
      if(enemy != NULL_DATA)
      {
        const fetchedEnemyInfo = await getMyContract().methods.colonies(enemy)?.call();
        setEnemyName(fetchedEnemyInfo.name);
      }
    }
    
    fetchEnemyName(enemy);
  }, [enemyName]);

  const handleDeclareWar = async (id) => {
    
    if (!window.ethereum) {
          alert("You need to install Metamask or other Web3 Wallet.");
          return;
        }

        if (!id || id === NULL_DATA) {
          alert("Your Colony is not at war");
          return;
        }
    
        setIsLoading(true);
    
        try {
          // 1. 계정 연결 요청 (이미 연결돼 있으면 바로 통과)
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          const userAddress = accounts[0];
    
          const web3 = new Web3(window.ethereum);
          const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    
          // 2. 공격 트랜잭션 전송
          const tx = await contract.methods.declareWar(id).send({
            from: userAddress,
          });
    
          alert("You declared War!");

          window.location.reload();
    
        } catch (error) {
          const msg = error.data.message;
          if (msg.includes("Only leader")) {
            alert("The only leader can do");
          } else {
            alert("failed to develop : " + (error.message || "Unknown Error"));
          }
    
        } finally {
          setIsLoading(false);
          await refreshData();
        }
  }

  const handleRequestAlliance = async (id) => {
    if (!window.ethereum) {
          alert("You need to install Metamask or other Web3 Wallet.");
          return;
        }
    
        setIsLoading(true);
    
        try {
          // 1. 계정 연결 요청 (이미 연결돼 있으면 바로 통과)
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          const userAddress = accounts[0];
    
          const web3 = new Web3(window.ethereum);
          const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    
          // 2. 공격 트랜잭션 전송
          const tx = await contract.methods.requestAlliance(id).send({
            from: userAddress,
          });
    
          alert("Request an alliance!");
    
          window.location.reload();
    
        } catch (error) {
          const msg = error?.data?.message;
          if (msg.includes("Not in colony")) {
            alert("You are not in a colony");
          } else if(msg.includes("Only leader")) {
            alert("The only leader can do");
          } else if(msg.includes("Invalid target")) {
            alert("Invalid target.");
          } else if(msg.includes("Cannot request self")) {
            alert("It cannot be requested by self.");
          } else if(msg.includes("Already allied")) {
            alert("Already allied.");
          } else if(msg.includes("At war")) {
            alert("Your colony is at war");
          } else {
            alert("failed to develop : " + (error.message || "Unknown Error"));
          }
    
        } finally {
          setIsLoading(false);
          await refreshData();
        }
  }

  const handleJoinColony = async (id) => {
    if (!window.ethereum) {
          alert("You need to install Metamask or other Web3 Wallet.");
          return;
        }
    
        setIsLoading(true);
    
        try {
          // 1. 계정 연결 요청 (이미 연결돼 있으면 바로 통과)
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          const userAddress = accounts[0];
          const web3 = new Web3(window.ethereum);
          const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
          // 2. 공격 트랜잭션 전송
          const tx = await contract.methods.joinColony(id).send({
            from: userAddress,
          });
          alert("You are a new member of this colony!");
    
          window.location.reload();
    
        } catch (error) {
          const msg = error?.data?.message;
          if(msg == undefined)
          {
            alert("failed to develop : " + (error));
          }
          else if (msg.includes("Already in colony")) {
            alert("You are Already in colony.");
          } else if(msg.includes("Not exist")) {
            alert("There's no this colony");
          } else {
            alert("failed to develop : " + (error.message || "Unknown Error"));
          }
    
        } finally {
          setIsLoading(false);
          await refreshData();
        }
  }
  

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="flex items-start justify-between mb-3">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-3xl">
              🏛️
          </div>
          
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            isAtWar 
              ? "bg-red-100 text-red-700" 
              : "bg-green-100 text-green-700"
          }`}>
            {isAtWar ? "⚔️ At War" : "🕊️ Truce"}
          </span>
        </div>
        
        
        {id == myColony ? (
            <h3 className="text-xl font-bold text-gray-900 mb-1">{name} (My Colony)</h3>
          ) :
          (
            <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
          )
        } 
        <p className="text-sm text-gray-600">({id})</p>
        <p className="text-sm text-gray-600">Leader : {leader}</p>
      </div>

      {/* Body */}
      <div className="p-6">
        
        {/* Stats */}
        <div className="space-y-3 mb-4">
          {/* Members */}
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <div className="flex items-center gap-1 text-gray-600">
                <Users className="w-4 h-4" />
                <span>Members</span>
              </div>
              <span className="font-semibold text-gray-900">
                {memberCnt}
              </span>
            </div>
          </div>

          {/* Level & xp */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-gray-600">
              <Shield className="w-4 h-4" />
              <span>Level {level}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">XP</span>
              <span className="font-semibold text-gray-900">{xp.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* HP */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <Heart className="w-4 h-4 text-red-500" />
            <span>HP</span>
          </div>
          <span className="font-semibold text-black-600">
            {hp?.toLocaleString()}
          </span>
        </div>

        {/* Enemy (전쟁 중인 콜로니) */}
        {isAtWar && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-gray-600">
              <Swords className="w-4 h-4 text-orange-600" />
              <span>Enemy</span>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900 truncate max-w-[180px]">
                {enemyName}
              </div>
              <div className="text-xs text-gray-500 font-mono">
                ({enemy.slice(0, 10)}...{enemy.slice(-8)})
              </div>
            </div>
          </div>
        )}

        
        <div className="space-y-2">
          
          <div className="flex gap-2">            
            {
                !hasColony &&
                <button className="flex-1 px-4 py-2 bg-[#E0C8FF] text-purple-900 rounded-lg hover:bg-purple-300 transition-colors font-semibold text-sm"
                        onClick={() => handleJoinColony(id)}>
                Join
                </button>
            }
            
          </div>
          
          {
            (isLeader && id != myColony) &&
            <div className="grid grid-cols-2 gap-2">
                <button className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-xs flex items-center justify-center gap-1"
                        onClick={() => handleDeclareWar(id)}>
                <Swords className="w-3 h-3" />
                Declare War
                </button>
                <button className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-xs flex items-center justify-center gap-1"
                        onClick={() => handleRequestAlliance(id)}>
                <Users className="w-3 h-3" />
                Form an alliance
                </button>
            </div>
          }
          
        </div>
      </div>
    </div>
  )
}
