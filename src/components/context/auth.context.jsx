import { createContext, useState } from "react";
import { getAccountAPI } from "../../service/auth.service";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext({
  avatar: "",
  email: "",
  fullName: "",
  id: "",
  phone: "",
  role: "",
  sum: 0,
  cartDetails: [],
  addresses: [],
  refresh: false,
  isFresh: false,
});

export const AuthWrapper = (props) => {
  const [user, setUser] = useState({
    avatar: "",
    email: "",
    fullName: "",
    id: "",
    phone: "",
    role: "",
    sum: 0,
    cartDetails: [],
    addresses: [],
  });

  const fetchUserInfor = async () => {
    try {
      const res = await getAccountAPI();
      if (res.data?.user) {
        setUser((prev) => ({
          ...prev,
          ...res.data.user,
        }));
      }
    } catch (error) {
      console.error("Lỗi lấy thông tin user:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUserInfor  }}>
      {props.children}
    </AuthContext.Provider>
  );
};
