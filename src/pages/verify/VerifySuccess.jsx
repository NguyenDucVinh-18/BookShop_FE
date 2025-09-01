import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../components/context/auth.context";

export default function VerifySuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      (async () => {
        try {
          localStorage.setItem("access_token", token);
          localStorage.setItem("role", "USER");
          navigate("/");
        } catch (err) {
          console.error("Auto login after verify failed:", err);
          navigate("/verify-failed");
        }
      })();
    } else {
      navigate("/verify-failed");
    }
  }, [location, navigate, setUser]);

  return <p>Đang xác thực và đăng nhập, vui lòng chờ...</p>;
}
