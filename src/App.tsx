import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import {PrivateRoute} from "./router/PrivateRoute.tsx";


const Home = () => <h2>Home</h2>

const App: React.FC = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<PrivateRoute />} >
                {/*<Route path="/dashboard" element={<Dashboard />} />*/}
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </BrowserRouter>
);

export default App;