import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import {PrivateRoute} from "./router/PrivateRoute.tsx";
import Dashboard from './pages/Dashboard.tsx';
import EditProfilePage from './pages/EditProfilePage.tsx';
import NavBar from './components/NavBar.tsx';



const Home = () => <h2>Home</h2>

const App: React.FC = () => (
    <BrowserRouter>
        <NavBar />
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<PrivateRoute />} >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/edit" element={<EditProfilePage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </BrowserRouter>
);

export default App;