import React from 'react'
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import {PrivateRoute} from "./router/PrivateRoute.tsx";
import Dashboard from './pages/Dashboard.tsx';
import EditProfilePage from './pages/EditProfilePage.tsx';
import ListingsPage from './pages/ListingsPage.tsx'
import NavBar from './components/NavBar.tsx';
import ListingDetailsPage from "./pages/ListingDetailsPage.tsx";
import CreateListingCategoryPage from './pages/CreateListingCategoryPage';
import CreateListingDetailsPage from './pages/CreateListingDetailPage.tsx';
import HomePage from "./pages/HomePage.tsx";


const App: React.FC = () => (
    <BrowserRouter>
        <NavBar />
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/listings" element={<ListingsPage />} />
            <Route path="/listings/:id" element={<ListingDetailsPage />} />

            <Route element={<PrivateRoute />}>
                <Route path="/create"           element={<CreateListingCategoryPage />} />
                <Route path="/create/:category" element={<CreateListingDetailsPage />} />
                <Route path="/dashboard"        element={<Dashboard />} />
                <Route path="/dashboard/edit"   element={<EditProfilePage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </BrowserRouter>
);

export default App;