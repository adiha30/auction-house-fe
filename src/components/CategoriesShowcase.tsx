import {useCategories} from "../hooks/useCategories.ts";
import {Box, Typography} from "@mui/material";
import Grid from "@mui/material/Grid";
import CategoryCard from "./CategoryCard.tsx";
import {useNavigate} from "react-router-dom";

export default function CategoriesShowcase() {
    const {data: categories = []} = useCategories();
    const nav = useNavigate();

    if (!categories.length) return null;

    return (
        <Box mt={4}>
            <Typography variant="h5" mb={2}>Browse Categories</Typography>
            <Grid container spacing={2}>
                {categories.map(category => (
                    <Grid item xs={6} sm={4} md={3} lg={2} key={category}>
                        <CategoryCard name={category} onClick={() => nav(`/listings?category=${encodeURIComponent(category)}`)} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}