import { Navigate } from "react-router-dom";
import { useAuthContext } from "./AuthContext";
import { type ReactNode } from "react";
import { Paths } from "../routes/paths";

type Props = {
    children: ReactNode;
    requireAdmin?: boolean;
  };

const AuthGuard = ({ children, requireAdmin = false }: Props) => {
  const { isAuthenticated, user } = useAuthContext();

  if (!isAuthenticated) return <Navigate to={`/${Paths.login}`} />;

  if (requireAdmin && user?.role !== "ADMIN")
    return <Navigate to={`/${Paths.login}`} />;

  return <>{children}</>;
};

export default AuthGuard;
