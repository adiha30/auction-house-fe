import React from "react";

function Register() {
    return (
        <section className="auth-section">
            <h2>Register</h2>
            <form className="auth-form">
                <label>
                    Username:
                    <input type="text" placeholder="Enter username"/>
                </label>
                <label>
                    Email:
                    <input type="email" placeholder="Enter your email"/>
                </label>
                <label>
                    Password:
                    <input type="password" placeholder="Enter passowrd"/>
                </label>
                <button type="submit">Sign Up</button>
            </form>
        </section>
    );
}

export default Register;