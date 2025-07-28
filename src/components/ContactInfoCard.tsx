import {Card, CardContent, Typography} from '@mui/material';
import {User} from '../api/userApi';
import {pretty} from "../pages/CreateListingPage.tsx";

interface ContactInfoCardProps {
    user: User;
    title: string;
}

export function ContactInfoCard({user, title}: ContactInfoCardProps) {
    return (
        <Card sx={{mt: 2, boxShadow: 3, borderRadius: 3, background: 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)'}}>
            <CardContent sx={{p: 3}}>
                <Typography variant="h6" sx={{mb: 2, fontWeight: 700, color: '#1976d2'}}>{title}</Typography>
                <Typography sx={{mb: 1, fontSize: 18}}>
                    <strong>Name:</strong> {pretty(user.firstName)} {pretty(user.lastName)}
                </Typography>
                <Typography sx={{mb: 1, fontSize: 18}}>
                    <strong>Email:</strong>&nbsp;
                    <a href={`mailto:${user.email}`}
                       style={{color: '#1976d2', textDecoration: 'underline', fontWeight: 500}}>
                        {user.email}
                    </a>
                </Typography>
                <Typography sx={{mb: 1, fontSize: 18}}>
                    <strong>Phone:</strong>&nbsp;
                    <a href={`tel:${user.phoneNumber}`} style={{color: '#1976d2', textDecoration: 'underline', fontWeight: 500}}>
                        {user.phoneNumber}
                    </a>
                </Typography>
                <Typography sx={{fontSize: 18}}>
                    <strong>Address:</strong>&nbsp;
                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${user.address.street}, ${user.address.city}, ${user.address.zipCode}, ${user.address.country}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{color: '#1976d2', textDecoration: 'underline', fontWeight: 500}}
                    >
                        {`${user.address.street}, ${user.address.city}, ${user.address.zipCode}, ${user.address.country}`}
                    </a>
                </Typography>
            </CardContent>
        </Card>
    );
}

