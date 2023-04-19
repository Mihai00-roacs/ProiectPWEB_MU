import React, {useEffect, useState} from 'react';
import {Navbar, NavItem, NavLink} from 'reactstrap';
import {Link, useNavigate} from 'react-router-dom';
import './NavMenu.css';

import {useAuth} from "../Authentication/Auth";

function NavMenu() {
    const {isAuthenticated} = useAuth();
    const logout = () => {
        fetch('https://localhost:44417/useraccount/Logout', {}).then(async res => {
            res = await res.json();
            if (res) {
                window.location.reload(false);
            }
        });
    }
    return (
        <header>
            <Navbar
                className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3 container-fluid"
                light>
                <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                    <ul className="navbar-nav flex-grow-1">
                        <li className="nav-item">
                            <a className="nav-link text-dark" href="/">
                                <img src="https://i.ibb.co/Mfx6RNV/Car-Sharing-logos-white.png"
                                     style={{width: '100px', height: '100px', margin: '-50px -10px -50px -10px'}}
                                />
                            </a>
                        </li>
                    </ul>
                    {!isAuthenticated ? (
                        <ul className="navbar-nav flex-row">
                            <NavItem>
                                <NavLink tag={Link} className="nav-link text-white" to="/home">Home</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="nav-link text-white" to="/login">Login</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="nav-link text-white"
                                         to="/register">Register</NavLink>
                            </NavItem>
                        </ul>
                    ) : (
                        <ul className="navbar-nav flex-row">
                            <NavItem>
                                <NavLink tag={Link} className="nav-link text-white" to="/home">Home</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="nav-link text-white" to="/add-offer">Add Offer</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="nav-link text-white" to="/offers">Rent a Car</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="nav-link text-white" to="/self-offers">View My Cars</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="nav-link text-white" to="/borrowed-cars">View My Borrowed
                                    Cars</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="nav-link text-white" to="/offers">Your Profile</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="nav-link text-white" onClick={logout}>Logout</NavLink>
                            </NavItem>
                        </ul>
                    )
                    }
                </div>
            </Navbar>
        </header>
    );
}

export default NavMenu;