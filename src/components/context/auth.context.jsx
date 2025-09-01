import { createContext, useState } from "react";

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
  refresh: false
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
    refresh: false
  });

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {props.children}
    </AuthContext.Provider>
  );
};
