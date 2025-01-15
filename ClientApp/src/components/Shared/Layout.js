import React, {useEffect, useState} from 'react';
import {Container} from 'reactstrap';
import NavMenu from './NavMenu';
import Footer from './Footer';
import Auth from "../Authentication/Auth";
import 'mapbox-gl/dist/mapbox-gl.css';
export let currentUser;
function Layout(props) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function fetchCurrentUser() {
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
                    setUser(user);
                } else {
                    console.error("Failed to fetch user.");
                }
            }
        }

        fetchCurrentUser();
    }, []);

    return (
            <div>
                <NavMenu/>
                <Container>
                    {props.children}
                </Container>
                <Footer/>
            </div>
    );
}

export default Layout;