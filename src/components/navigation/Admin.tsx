import React, { useEffect, useState } from "react";
import AdminLogin from "../AdminLogin";
import AdminProfile from "../AdminProfile";
import Cookies from "js-cookie";

function Admin() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const token = Cookies.get("authToken");
        const refreshToken = localStorage.getItem("refreshToken");
        if (token && refreshToken) {
            setIsAuthenticated(true);
        } else {
            handleLogout();
        }
    }, []);

    const handleLogin = (token: string) => {
        Cookies.set("authToken", token, { expires: 1 });
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        Cookies.remove("authToken");
        setIsAuthenticated(false);
    };

    return isAuthenticated ? <AdminProfile onLogout={handleLogout} /> : <AdminLogin onLogin={handleLogin} />;
}

export default Admin;
