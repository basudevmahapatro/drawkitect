import LoginForm from "../components/shadcn-space/blocks/login-01/login";
import { useAuth } from "../store/AuthProvider";
import { Navigate } from "react-router-dom";
import LoadingDialog from "../components/LoadingDialog";

const Login = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingDialog />;
    }

    if (user) {
        return <Navigate to="/workspace" replace />;
    }
    return (
        <LoginForm />
    );
};
export default Login;