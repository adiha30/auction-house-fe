/**
 * Dashboard Component
 * 
 * Main dashboard interface with a tabbed navigation system that adapts based on user role:
 * - Profile tab: Shows user profile information
 * - My Listings tab: Displays listings created by the user (non-admin only)
 * - Listings won tab: Shows listings the user has won (non-admin only)
 * - User Manager tab: Admin interface for user management (admin only)
 * - Disputes tab: Shows disputes (all users, with different views for admin/non-admin)
 * 
 * Uses a vertical tab layout for navigation between different dashboard sections.
 */
import {Box, Tab, Tabs} from "@mui/material";
import {useState} from "react";
import ProfilePage from "./ProfilePage.tsx";
import MyListingsPage from "./MyListingsPage.tsx";
import {useCurrentUser} from "../hooks/useCurrentUser.ts";
import UserManagerPage from "./UserManagerPage.tsx";
import MyDisputesPage from "./MyDisputesPage.tsx";
import ListingsWonPage from "./ListingsWonPage.tsx";
import AllDisputesPage from "./AllDisputesPage.tsx";

export default function Dashboard() {
    const [selectedTab, setSelectedTab] = useState<'profile' | 'listings' | 'disputes' | 'userManager'>('profile');
    const {data: user} = useCurrentUser();
    const isAdmin = user?.role === 'ADMIN';

    const tabStyles = {
        alignItems: 'flex-start',
        padding: '12px 24px',
        fontSize: '1rem',
        fontWeight: 500,
        textTransform: 'none',
        '&.Mui-selected': {
            fontWeight: 'bold',
        },
    };

    return (
        <Box mt={4} display="flex" alignItems="flex-start" px={2}>
            <Tabs
                orientation="vertical"
                value={selectedTab}
                onChange={(_, v) => setSelectedTab(v)}
                sx={{
                    borderRight: 1,
                    borderColor: 'divider',
                    mr: 4,
                    minWidth: 200,
                }}
            >
                <Tab label="Profile" value="profile" sx={tabStyles}/>
                {!isAdmin && <Tab label="My Listings" value="listings" sx={tabStyles}/>}
                {!isAdmin && <Tab label="Listings won" value="wonListings" sx={tabStyles}/>}
                {isAdmin && <Tab label="User Manager" value="userManager" sx={tabStyles}/>}
                <Tab label="Disputes" value="disputes" sx={tabStyles}/>

            </Tabs>

            <Box flexGrow={1}>
                {selectedTab === 'profile' ? <ProfilePage/> :
                    selectedTab === 'listings' ? <MyListingsPage/> :
                        selectedTab === 'userManager' ? <UserManagerPage/> :
                            selectedTab === 'disputes' ? (isAdmin ? <AllDisputesPage/> : <MyDisputesPage/>) :
                    selectedTab === 'wonListings' ? <ListingsWonPage /> :
                    null}
            </Box>
        </Box>
    );
}