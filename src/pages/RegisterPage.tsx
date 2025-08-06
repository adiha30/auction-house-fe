/**
 * RegisterPage Component
 *
 * Provides a comprehensive user registration form with the following fields:
 * - Username
 * - Email
 * - Password
 * - First name and last name
 * - Phone number
 * - Address information (street, city, zip code, country)
 * - Optional credit card information
 *
 * Uses Formik for form handling and Yup for complex validation rules.
 * Upon successful registration, redirects to the dashboard page.
 */
import {Field, Form, Formik} from 'formik';
import * as Yup from 'yup';
import {Box, Button, Grid, Stack, TextField, Typography} from '@mui/material';
import {useRegister} from '../hooks/useRegister';
import {useNavigate} from 'react-router-dom';

const schema = Yup.object({
    username: Yup.string()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must be 20 characters or less')
        .required('Username is required'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .max(20, 'Password must be 20 characters or less')
        .required(),
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    phoneNumber: Yup.string().matches(/^[0-9]+$/, "Must be only digits").min(10, 'Must be exactly 10 digits').max(10, 'Must be exactly 10 digits').required('Phone number is required'),
    address: Yup.object({
        street: Yup.string().required('Street is required'),
        city: Yup.string().required('City is required'),
        zipCode: Yup.string().required('Zip code is required'),
        country: Yup.string().required('Country is required')
    }).required(),
    ccInfo: Yup.object({
        cardNumber: Yup.string()
            .matches(/^\d[\d\s-]{14,23}\d$/, 'Card number must be 16 digits')
            .transform(v => v.replace(/[\s-]/g, ''))
            .notRequired(),
        expirationDate: Yup.string()
            .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiration date must be in MM/YY format')
            .notRequired(),
        cvv: Yup.string()
            .matches(/^\d{3,4}$/, 'CVV must be 3 or 4 digits')
            .notRequired()
    }).notRequired()
});

export default function RegisterPage() {
    const register = useRegister();
    const nav = useNavigate();

    return (
        <Formik
            initialValues={{
                username: '',
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                address: {street: '', city: '', zipCode: '', country: ''},
                ccInfo: {}
            }}
            validationSchema={schema}
            onSubmit={(values) => register.mutateAsync(values).then(() => nav('/dashboard'))}
        >
            {({errors, touched}) => (
                <Form>
                    <Box display="flex" flexDirection="column" gap={2} width={{xs: '90%', sm: 500}} mx="auto" mt={8}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Register
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Field
                                    as={TextField}
                                    label="Username"
                                    name="username"
                                    fullWidth
                                    error={touched.username && !!errors.username}
                                    helperText={touched.username && errors.username}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    as={TextField}
                                    label="Email"
                                    name="email"
                                    type="email"
                                    fullWidth
                                    error={touched.email && !!errors.email}
                                    helperText={touched.email && errors.email}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    as={TextField}
                                    label="Phone Number"
                                    name="phoneNumber"
                                    fullWidth
                                    error={touched.phoneNumber && !!errors.phoneNumber}
                                    helperText={touched.phoneNumber && errors.phoneNumber}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    as={TextField}
                                    label="Password"
                                    name="password"
                                    type="password"
                                    fullWidth
                                    error={touched.password && !!errors.password}
                                    helperText={touched.password && errors.password}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    as={TextField}
                                    label="First Name"
                                    name="firstName"
                                    fullWidth
                                    error={touched.firstName && !!errors.firstName}
                                    helperText={touched.firstName && errors.firstName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    as={TextField}
                                    label="Last Name"
                                    name="lastName"
                                    fullWidth
                                    error={touched.lastName && !!errors.lastName}
                                    helperText={touched.lastName && errors.lastName}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" mt={2}>Address</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    as={TextField}
                                    label="Street"
                                    name="address.street"
                                    fullWidth
                                    error={touched.address?.street && !!errors.address?.street}
                                    helperText={touched.address?.street && errors.address?.street}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    as={TextField}
                                    label="City"
                                    name="address.city"
                                    fullWidth
                                    error={touched.address?.city && !!errors.address?.city}
                                    helperText={touched.address?.city && errors.address?.city}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    as={TextField}
                                    label="Zip Code"
                                    name="address.zipCode"
                                    fullWidth
                                    error={touched.address?.zipCode && !!errors.address?.zipCode}
                                    helperText={touched.address?.zipCode && errors.address?.zipCode}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    as={TextField}
                                    label="Country"
                                    name="address.country"
                                    fullWidth
                                    error={touched.address?.country && !!errors.address?.country}
                                    helperText={touched.address?.country && errors.address?.country}
                                />
                            </Grid>
                        </Grid>
                        <Button variant="contained" type="submit" disabled={register.isPending} sx={{mt: 2}}>
                            Register
                        </Button>

                        <Stack direction="row" justifyContent="center" spacing={1} mt={1}>
                            <Button variant="text" size="small" onClick={() => nav('/')}>
                                Home
                            </Button>
                            <Typography variant="body2" sx={{lineHeight: 2}}>•</Typography>
                            <Button variant="text" size="small" onClick={() => nav('/login')}>
                                Already have an account? Login
                            </Button>
                        </Stack>
                    </Box>
                </Form>
            )}
        </Formik>
    );
}