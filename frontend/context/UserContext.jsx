"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { fetchMyInfo } from '../utils/ReadProperties';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }) {
    const [userData, setUserData] = useState(null);
    const [colonyData, setColonyData] = useState(null);
    const [isDataLoading, setIsDataLoading] = useState(true);

    const refreshData = async () => {
        setIsDataLoading(true);
        try {
            const data = await fetchMyInfo(); // 서버 액션 호출
            setUserData(data.userInfo);
            setColonyData(data.colonyInfo);
        } catch (e) {
            console.error("Failed to fetch user data:", e);
        } finally {
            setIsDataLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    const value = { userData, colonyData, isDataLoading, refreshData };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}