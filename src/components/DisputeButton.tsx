/**
 * DisputeButton displays a button to open or view a dispute for a listing, depending on dispute status.
 *
 * @module components/DisputeButton
 */

import {ListingDetails} from "../api/listingApi.ts";
import {useNavigate} from "react-router-dom";
import React, {useEffect} from "react";
import {checkDisputeExists} from "../api/disputeApi.ts";
import {Button, CircularProgress} from "@mui/material";

/**
 * Props for the DisputeButton component.
 * @property listing - The listing for which the dispute button is shown.
 * @property onOpenDispute - Callback to open a new dispute.
 */
type DisputeButtonProps = {
    listing: ListingDetails;
    onOpenDispute: (listing: ListingDetails) => void;
}

/**
 * Renders a button to open a dispute or view an existing dispute for a listing.
 *
 * @param listing - The listing for which the dispute button is shown.
 * @param onOpenDispute - Callback to open a new dispute.
 */
const DisputeButton: React.FC<DisputeButtonProps> = ({listing, onOpenDispute}) => {
    const [disputeId, setDisputeId] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDisputeStatus = async () => {
            setIsLoading(true);
            const id = await checkDisputeExists(listing.listingId);
            setDisputeId(id);
            setIsLoading(false);
        };

        fetchDisputeStatus();
    }, [listing.listingId]);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (disputeId) {
            navigate(`/disputes/${disputeId}`);
        } else {
            onOpenDispute(listing);
        }
    };

    if (isLoading) {
        return <CircularProgress size={24}/>;
    }

    return (
        <Button
            variant="outlined"
            size="small"
            onClick={handleClick}
        >
            {disputeId ? 'View Dispute' : 'Open Dispute'}
        </Button>
    );
};

export default DisputeButton;