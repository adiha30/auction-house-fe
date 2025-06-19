import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import ProfilePage from "./ProfilePage.tsx";
import MyListingsPage from "./MyListingsPage.tsx";

export default function Dashboard() {
      const [selectedTab, setSelectedTab] = useState<'profile' | 'listings'>('profile');

          return (
            <Box mt={4} display="flex" alignItems="flex-start" px={2}>
                  <Tabs
                    orientation="vertical"
                    value={selectedTab}
                    onChange={(_, v) => setSelectedTab(v)}
                    sx={{ borderRight: 1, borderColor: 'divider', mr: 4 }}
                  >
                    <Tab label="Profile" value="profile" />
                    <Tab label="My Listings" value="listings" />
                  </Tabs>

              <Box flexGrow={1}>
                    {selectedTab === 'profile' ? <ProfilePage /> : <MyListingsPage />}
                  </Box>
            </Box>
      );
    }