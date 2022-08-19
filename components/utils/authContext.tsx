import { User } from '@firebase/auth';
import React, { useContext, createContext, Dispatch, SetStateAction } from 'react'

const AuthContext = createContext(null);

interface Props {
    children: React.ReactNode,
    value: {
        currentUser: User,
        setCurrentUser: Dispatch<SetStateAction<User>>
    }
}

export function AuthProvider({children, value}: Props) {
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthValue() {
    return useContext(AuthContext);
} 