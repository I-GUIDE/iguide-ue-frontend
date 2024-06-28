import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        auth.loginCallback().then(() => {
            navigate('/userprofile');
        });
    }, []);

    return <div>Processing signin...</div>;
}