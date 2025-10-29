import { Navigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

const PublicRoute = ({ children }) => {
  const { token } = useUserContext();

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
