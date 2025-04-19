import React from "react";

function Login() {
    return (
        <section className="auth-section">
            <h2>Login</h2>
            <form className="auth-form">
                <label>
                    Email:
                    <input type="email" placeholder="Enter your email"/>
                </label>
                <label>
                    Password:
                    <input type="password" placeholder="Enter passowrd"/>
                </label>
                <button type="submit">Sign In</button>
            </form>
        </section>
    );
}

export default Login;