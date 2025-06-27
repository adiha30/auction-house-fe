import {Box, Tab, Tabs} from "@mui/material";
import {useState} from "react";
import ProfilePage from "./ProfilePage.tsx";
import MyListingsPage from "./MyListingsPage.tsx";
import {useCurrentUser} from "../hooks/useCurrentUser.ts";
import UserManagerPage from "./UserManagerPage.tsx";

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
                {isAdmin && <Tab label="User Manager" value="userManager" sx={tabStyles}/>}
                {isAdmin && <Tab label="Disputes" value="disputes" sx={tabStyles}/>}

            </Tabs>

            <Box flexGrow={1}>
                {selectedTab === 'profile' ? <ProfilePage/> :
                    selectedTab === 'listings' ? <MyListingsPage/> :
                        selectedTab === 'userManager' ? <UserManagerPage /> :
                            selectedTab === 'disputes' ? <div>Disputes Section (Coming Soon)</div> :
                                null}
            </Box>
        </Box>
    );
}