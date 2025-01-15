import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({
    isAuthenticated: false,
    userName: '',
    userId: '',
    setIsAuthenticated: () => {}
});

export let useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState('');
    useEffect(() => {
        async function fetchUser() {
            try {
                const token = localStorage.getItem("jwtToken");
                if (token) {
                    const res = await fetch(`${process.env.REACT_APP_AUTH_API_URL}/GetCurrentUser`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (res.ok) {
                        const user = await res.json();
                        setIsAuthenticated(true);
                        setUserName(user.userName);
                        setUserId(user.userId)
                    } else {
                        setIsAuthenticated(false);
                    }
                }
            } catch (err) {
                console.error("Error fetching user:", err);
                setIsAuthenticated(false);
            }
        }

        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userName, setUserName, userId }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
