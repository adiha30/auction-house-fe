import { Card, CardContent, Typography } from '@mui/material';
import { User } from '../api/userApi';

interface ContactInfoCardProps {
  user: User;
  title: string;
}

export function ContactInfoCard({ user, title }: ContactInfoCardProps) {
  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography>Name: {user.firstName} {user.lastName}</Typography>
        <Typography>Email: {user.email}</Typography>
        <Typography>Phone: {user.phoneNumber}</Typography>
        <Typography>Address: {`${user.address.street}, ${user.address.city}, ${user.address.zipCode}, ${user.address.country}`}</Typography>
      </CardContent>
    </Card>
  );
}

