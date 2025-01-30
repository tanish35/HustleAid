import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { ClipLoader } from "react-spinners";
const ProtectedRoute = () => {
  const { loadingUser, userDetails } = useUser();

  if (loadingUser) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <ClipLoader color="#123abc" size={50} />
      </div>
    );
  }

  return userDetails ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
