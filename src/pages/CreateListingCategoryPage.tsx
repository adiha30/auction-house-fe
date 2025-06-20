import {useNavigate} from "react-router-dom";
import {useCategories} from "../hooks/useCategories";
import {Box, Paper, Typography} from "@mui/material";
import Grid from "@mui/material/Grid";
import {pretty} from "./CreateListingPage.tsx";

export default function CreateListingCategoryPage() {
    const {data: categories = []} = useCategories();
    const nav = useNavigate();

    return (
        <Box mt={4} display="flex" justifyContent="center">
            <Paper sx={{p: 4, width: 600}}>
                <Typography variant="h5" mb={2}>
                    Pick a category
                </Typography>

                <Grid container spacing={2}>
                    {categories.map(category => (
                        <Grid item xs={4} key={category}>
                            <Paper sx={{p: 2, textAlign: 'center', cursor: 'pointer', '&:hover': {boxShadow: 6},}}
                                   onClick={() => nav(`/create/${encodeURIComponent(category)}`)}>
                                {pretty(category)}
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Box>
    );
}