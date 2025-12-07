"use client";

import { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (context === undefined) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};

export function LoadingProvider({ children }) {
    const [isLoading, setIsLoading] = useState(false);

    const value = { isLoading, setIsLoading };

    return (
        <LoadingContext.Provider value={value}>
            {children}
        </LoadingContext.Provider>
    );
}