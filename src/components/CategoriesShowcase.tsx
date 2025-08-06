/**
 * CategoriesShowcase displays a grid of up to five featured categories and an option to view all categories.
 * Each category is shown as a card and clicking navigates to the listings page filtered by that category.
 *
 * @module components/CategoriesShowcase
 */

/**
 * Renders a showcase of categories for browsing listings.
 *
 * @returns The categories showcase section component.
 */
import {useCategories} from "../hooks/useCategories.ts";
import {Box, Typography} from "@mui/material";
import Grid from "@mui/material/Grid";
import CategoryCard from "./CategoryCard.tsx";
import {useNavigate} from "react-router-dom";

/**
 * CategoriesShowcase component displays a grid of up to five featured categories as cards,
 * along with an option to view all categories. Clicking a category navigates to the listings
 * page filtered by that category, while the "All Categories" card navigates to the unfiltered listings page.
 *
 * @returns {JSX.Element | null} The rendered categories showcase section, or null if no categories are available.
 */
export default function CategoriesShowcase() {
    const {data: categories = []} = useCategories();
    const nav = useNavigate();

    if (!categories.length) return null;

    return (
        <Box mt={4}>
            <Typography variant="h5" mb={2}>Browse Categories</Typography>
            <Grid container spacing={5} mb={5}>
                {categories.slice(0, 5).map(category => (
                    <Grid item xs={6} sm={4} md={3} lg={2} key={category.name}
                          sx={{display: 'flex', '& > *': {width: '100%'}}}>
                        <CategoryCard name={category.name} icon={category.icon}
                                      onClick={() => nav(`/listings?category=${encodeURIComponent(category.name)}`)}/>
                    </Grid>
                ))}
                <Grid item xs={6} sm={4} md={3} lg={2} key="all-categories"
                      sx={{display: 'flex', '& > *': {width: '100%'}}}>
                    <CategoryCard name="All Categories" icon="📱" onClick={() => nav('/listings')}/>
                </Grid>
            </Grid>
        </Box>
    );
}