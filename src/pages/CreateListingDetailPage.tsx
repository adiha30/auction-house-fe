import {Navigate, useParams} from "react-router-dom";
import CreateListingPage from "./CreateListingPage.tsx";

export default function CreateListingDetailPage() {
    const {category} = useParams<{ category: string }>();

    if (!category) return <Navigate to="/create" replace/>;

    return <CreateListingPage initialCategory={decodeURIComponent(category)} />;
}