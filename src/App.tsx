import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';


const Home = () => <h2>Home</h2>
const Login = () => <h2>Login page stub</h2>
const Register = () => <h2>Register page stub</h2>

const App: React.FC = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </BrowserRouter>
);

export default App;