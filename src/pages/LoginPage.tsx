/**
 * LoginPage Component
 *
 * Provides the user authentication interface with:
 * - Username/email input field
 * - Password input field
 * - Login button
 * - Navigation links to home page and registration page
 *
 * Uses Formik for form handling and Yup for validation.
 * Upon successful authentication, redirects to the home page.
 */
import {Field, Form, Formik} from 'formik';
import * as Yup from 'yup';
import {Box, Button, Stack, TextField, Typography} from '@mui/material';
import {useLogin} from '../hooks/useLogin';
import {useNavigate} from 'react-router-dom';

const schema = Yup.object({
    username: Yup.string().required(),
    password: Yup.string().required(),
});

export default function LoginPage() {
    const login = useLogin();
    const nav = useNavigate();

    return (
        <Formik
            initialValues={{username: '', password: ''}}
            validationSchema={schema}
            onSubmit={(values) => login.mutateAsync(values).then(() => nav('/'))}
        >
            {({errors, touched}) => (
                <Form>
                    <Box display="flex" flexDirection="column" gap={2} width={300} mx="auto" mt={8}>
                        <Field
                            as={TextField}
                            label="Username or email"
                            name="username"
                            error={touched.username && !!errors.username}
                            helperText={touched.username && errors.username}
                        />
                        <Field
                            as={TextField}
                            label="Password"
                            name="password"
                            type="password"
                            error={touched.password && !!errors.password}
                            helperText={touched.password && errors.password}
                        />
                        <Button variant="contained" type="submit" disabled={login.isPending}>
                            Log in
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
