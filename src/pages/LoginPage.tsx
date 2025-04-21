import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Box } from '@mui/material';
import { useLogin } from '../hooks/useLogin';
import { useNavigate } from 'react-router-dom';

const schema = Yup.object({
    username: Yup.string().required(),
    password: Yup.string().required(),
});

export default function LoginPage() {
    const login = useLogin();
    const nav = useNavigate();

    return (
        <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={schema}
            onSubmit={(values) => login.mutateAsync(values).then(() => nav('/dashboard'))}
        >
            {({ errors, touched }) => (
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
                    </Box>
                </Form>
            )}
        </Formik>
    );
}
