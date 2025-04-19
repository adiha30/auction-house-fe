import React from "react";
import { Link } from "react-router-dom";
import "../styles/NavBar.css";

function NavBar() {
    return (
        <nav className="nav-bar">
            <div className="nav-left">
                <Link to="/">Home</Link>
                <Link to="/categories">Categories</Link>
                <Link to="/dashboard">My Dashboard</Link>
            </div>

            <div className="nav-right">
                <Link to="/login" className="nav-btn nav-login-btn">
                    Login
                </Link>
                <Link to="/register" className="nav-btn nav-register-btn">
                    Register
                </Link>
            </div>
        </nav>
    );
}

export default NavBar;
