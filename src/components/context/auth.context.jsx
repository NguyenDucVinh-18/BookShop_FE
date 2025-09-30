import { createContext, useState } from "react";
import { getAccountAPI } from "../../service/auth.service";
import { getCartAPI } from "../../service/cart.service";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext({
  cartDetails: [],
});

export const AuthWrapper = (props) => {
  const [user, setUser] = useState({cartDetails: [],});

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

  const fetchCartInfor = async () => {
    const resGetCart = await getCartAPI();
      if (resGetCart.data && resGetCart.data.items) {
        setUser((prev) => ({
          ...prev,
          cartDetails: resGetCart.data.items,
        }));
      }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUserInfor, fetchCartInfor }}>
      {props.children}
    </AuthContext.Provider>
  );
};
