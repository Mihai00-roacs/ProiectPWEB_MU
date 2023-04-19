import React, { Component } from 'react';
import { Link } from 'react-router-dom';

function Footer() {
        return (
            <footer className="border-top footer text-muted">
                <div className="container as">
                    &copy; 2023 - CarSharing  <a href="https://en.wikipedia.org/wiki/Peer-to-peer_carsharing" style={{ color: 'white', textDecoration: 'none' }}>
                        What is peer to peer car rental?
                    </a>
        </div >
    </footer >
        );
}
export default Footer;
