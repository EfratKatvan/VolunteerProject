import { createContext, useEffect, useCallback, useState, type ReactNode } from "react";
import { type UserType } from "../types/users.types";
import { getSession, setSession } from "./auth.utils";
import { loginByToken } from "../services/auth.service";

type AuthStateType = {
    user: UserType | null,
    isInitialized: boolean
}

type AuthContextType = AuthStateType & {
    setUser: (user: UserType) => void
    isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextType | null>(null)

type Props = {
    children: ReactNode
}

export const AuthProvider = ({ children }: Props) => {
    const [authState, setAuthState] = useState<AuthStateType>({ user: null, isInitialized: false })

    const setUser = useCallback((user: UserType) => {
        setAuthState((prev) => ({ ...prev, user }))
    }, [])

    useEffect(() => {
        const initialize = async () => {
            const token = getSession()
            try {
                if (token) {
                    const user = await loginByToken(token);
                    setSession(token)
                    setAuthState((prev) => ({ ...prev, isInitialized: true, user }))
                } else {
                    throw Error('Unauthorized')
                }
            } catch (error) {
                setAuthState((prev) => ({ ...prev, isInitialized: true }))
            }
        }
        initialize()
    }, [])

    return <AuthContext.Provider value={{ ...authState, setUser, isAuthenticated: !!authState.user }}>
        {children}
    </AuthContext.Provider>
}