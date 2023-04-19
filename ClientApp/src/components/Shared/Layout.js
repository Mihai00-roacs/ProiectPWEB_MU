import React from 'react';
import {Container} from 'reactstrap';
import NavMenu from './NavMenu';
import Footer from './Footer';
import Auth from "../Authentication/Auth";
import 'mapbox-gl/dist/mapbox-gl.css';
export let currentUser = fetch('https://localhost:44417/useraccount/currentUser')
    .then(async res => {
        return await res.json();
    })

function Layout(props) {

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