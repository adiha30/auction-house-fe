/**
 * CreateListingDetailPage Component
 *
 * Router component that handles the second step of listing creation:
 * - Extracts the selected category from URL parameters
 * - Redirects to the category selection page if no category is specified
 * - Renders the main listing creation form with the selected category
 *
 * Acts as a bridge between category selection and the detailed listing form.
 */
import {Navigate, useParams} from "react-router-dom";
import CreateListingPage from "./CreateListingPage.tsx";

export default function CreateListingDetailPage() {
    const {category} = useParams<{ category: string }>();

    if (!category) return <Navigate to="/create" replace/>;

    return <CreateListingPage initialCategory={decodeURIComponent(category)}/>;
}