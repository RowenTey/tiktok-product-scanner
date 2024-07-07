/* eslint-disable react/prop-types */
import React, { useContext, useState, useEffect } from "react";
import { api } from "../api";

export const AuthContext = React.createContext({
  isLoggedIn: false,
  login: () => {},
  signup: () => {},
  error: { status: false, text: "" },
  user: { name: "", email: "" },
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState({ status: false, text: "" });
  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token == null) {
      return;
    }
    
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    // Make subsequent requests using Axios
    console.log("Token from session storage: ", token)
    
    api.get("/user").then((response) => {
      // Handle response
      console.log(response.data[0])
      setUser(response.data[0]);
      setIsLoggedIn(true);
    }).catch((error) => {
      // Handle error
      console.error("Request failed:", error);
    });
  }, []);

  const login = async (user) => {
    try {
      const response = await api.post("/user/signin", user);

      if (response.status != 200) {
        console.log(response.data);
        setError({ status: true, text: "Error logging in" });
        return false;
      }
      
      setIsLoggedIn(true);
      console.log(response.data);
      setUser(response.data.result);

      setError({ status: false, text: "" });
      sessionStorage.setItem("token", response.data.token);
      
      api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
      return true;
    } catch (err) {
      switch (err.response.status) {
        case 400:
          console.log("Incorrect Password.");
          setError({
            status: true,
            text: "Incorrect Password, Please try again",
          });
          setTimeout(() => {
            setError({ status: false, text: "" });
          }, 5000);
          break;
        case 401:
          console.log("User not found.");
          setError({ status: true, text: "User not found" });
          setTimeout(() => {
            setError({ status: false, text: "" });
          }, 5000);
          break;
        default:
          console.log(err.message);
          break;
      }
      return false;
    }
  };

  const signup = async (user) => {
    try {
      const response = await api.post("/user/signup", user);
      if (response.status == 200) {
        console.log(response.data);
        setError({ status: true, text: "Error signing up" });
        return false;
      }
      
      setIsLoggedIn(true);
      console.log(response.data);
      setUser(response.data.result);
      setError({ status: false, text: "" });
      sessionStorage.setItem("token", response.data.token);
      return true;
    } catch (err) {
      switch (err.response.status) {
        case 400:
          console.log("User existed.");
          setError({ status: true, text: "User existed" });
          setTimeout(() => {
            setError({ status: false, text: "" });
          }, 5000);
          break;
        default:
          console.log(err.message);
          break;
      }
      return false;
    }
  };

  const logout = async () => {
    setIsLoggedIn(false);
    setUser({ name: "", email: "" });
    sessionStorage.removeItem("token");
    console.log("Logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        login: login,
        logout: logout,
        signup: signup,
        user: user,
        error: error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
