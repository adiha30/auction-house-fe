import {Field, Form, Formik} from 'formik';
import * as Yup from 'yup';
import {Box, Button, Stack, TextField, Typography} from '@mui/material';
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
            initialValues={{username: '', email: '', password: '', ccInfo: {}}}
            validationSchema={schema}
            onSubmit={(values) => register.mutateAsync(values).then(() => nav('/dashboard'))}
        >
            {({errors, touched}) => (
                <Form>
                    <Box display="flex" flexDirection="column" gap={2} width={300} mx="auto" mt={8}>
                        <Field
                            as={TextField}
                            label="Username"
                            name="username"
                            error={touched.username && !!errors.username}
                            helperText={touched.username && errors.username}
                        />
                        <Field
                            as={TextField}
                            label="Email"
                            name="email"
                            type="email"
                            error={touched.email && !!errors.email}
                            helperText={touched.email && errors.email}
                        />
                        <Field
                            as={TextField}
                            label="Password"
                            name="password"
                            type="password"
                            error={touched.password && !!errors.password}
                            helperText={touched.password && errors.password}
                        />
                        <Button variant="contained" type="submit" disabled={register.isPending}>
                            Register
                        </Button>

                        <Stack direction="row" justifyContent="center" spacing={1} mt={1}>
                            <Button variant="text" size="small" onClick={() => nav('/')}>
                                Home
                            </Button>
                            <Typography variant="body2" sx={{lineHeight: 2}}>•</Typography>
                            <Button variant="text" size="small" onClick={() => nav('/register')}>
                                Don't have an account? Register
                            </Button>
                        </Stack>
                    </Box>
                </Form>
            )}
        </Formik>
    );
}