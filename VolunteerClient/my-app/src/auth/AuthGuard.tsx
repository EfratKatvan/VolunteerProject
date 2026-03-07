import { Navigate } from "react-router"
import { useAuthContext } from "./useAuthContext"
import { Paths } from "../routes/paths"
import type { ReactNode } from "react"
import type { UserRole } from "../types/enums.types"
//זו קומפוננטה שעוטפת עמודים שדורשים התחברות.
type Props = {
    children: ReactNode;
    roles?: UserRole[]
}

const AuthGuard = ({ children, roles }: Props) => {
    const { isAuthenticated, isInitialized, user } = useAuthContext()

    if (!isInitialized) {
        return <h1>Loading...</h1>
    }

    if (!isAuthenticated) {
        return <Navigate to={`/${Paths.login}`} />
    }

    if (roles && !roles.includes(user!.userRole)) {
        console.log('user:', user);
        console.log('user.userRole:', user!.userRole, typeof user!.userRole);
        console.log('roles:', roles, typeof roles[0]);
        return <h1>Unauthorized</h1>
    }

    return <>{children}</>
}

export default AuthGuard