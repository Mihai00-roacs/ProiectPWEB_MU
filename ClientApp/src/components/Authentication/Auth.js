import { createContext, useContext, useEffect, useState } from 'react';
import {currentUser} from "../Shared/Layout";

const AuthContext = createContext({
    isAuthenticated : false,
    userName : '',
    setIsAuthenticated: () => {}
});

export let useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState(false);
    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await currentUser;
                setIsAuthenticated(res.isAuthenticated);
                setUserName(res.userName)
            } catch (err) {
                console.log(err);
            }
        }
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated,userName,setUserName}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;