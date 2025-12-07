"use client";

import { useLoading } from '@/context/LoadingContext';
import FullPageLoading from './FullPageLoading';

export default function LayoutContent({ children, message }) {
    const { isLoading } = useLoading();

    return (
        <>
            {isLoading && <FullPageLoading message={message} />}
            
            <div 
                className={`transition-opacity duration-300 ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
            >
                {children}
            </div>
        </>
    );
}