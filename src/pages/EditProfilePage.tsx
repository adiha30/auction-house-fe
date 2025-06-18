import {Box, Button, Paper, TextField, Typography} from '@mui/material';
import {Field, Form, Formik} from 'formik';
import * as Yup from 'yup';
import {useCurrentUser} from '../hooks/useCurrentUser';
import {useUpdateUser} from '../hooks/useUpdateUser';
import {useNavigate} from 'react-router-dom';

const schema = Yup.object({
    username: Yup.string().min(3).max(20).required(),
    firstName: Yup.string().min(3).max(40).required(),
    lastName: Yup.string().min(3).max(40).required(),
    email: Yup.string().email().required(),
    password: Yup.string().min(8).max(20).notRequired(),
    ccInfo: Yup.object({
        ccNumber: Yup.string()
            .matches(/^\d[\d\s-]{14,23}\d$/, 'Card number must be 16 digits')
            .transform(v => v.replace(/[\s-]/g, ''))
            .notRequired(),
        ccExpiry: Yup.string().matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'MM/YY').notRequired(),
        ccCvc: Yup.string().matches(/^\d{3,4}$/, '3‑4 digits').notRequired(),
    }).notRequired(),
});

export default function EditProfilePage() {
    const {data: user} = useCurrentUser();
    const update = useUpdateUser();
    const nav = useNavigate();

    if (!user) return null;

    const initial = {
        username: user.username,
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        email: user.email,
        password: '',
        ccInfo: {
            ccNumber: user.ccInfo?.ccNumber ? formatCreditCard(user.ccInfo.ccNumber) : '',
            ccExpiry: user.ccInfo?.ccExpiry ?? '',
            ccCvc: user.ccInfo?.ccCvc ?? ''
        },
    };

    // Function to format credit card number with hyphens
    function formatCreditCard(value: string): string {
        const digits = value.replace(/\D/g, '');
        const parts = [];

        for (let i = 0; i < digits.length; i += 4) {
            parts.push(digits.substring(i, i + 4));
        }

        return parts.join('-');
    }

    // Function to format expiry date with slash
    function formatExpiryDate(value: string): string {
        const digits = value.replace(/\D/g, '');

        if (digits.length <= 2) {
            return digits;
        }

        return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
    }

    return (
        <Box mt={4} display="flex" justifyContent="center">
            <Paper sx={{ p: 4, width: 400 }}>
                <Typography variant="h5" mb={2}>
                    Edit Profile
                </Typography>

                <Formik
                    initialValues={initial}
                    validationSchema={schema}
                    onSubmit={(values) => {
                        const payload: Record<string, unknown> = { ...values };

                        if (!payload.password) delete payload.password;

                        if (!payload.firstName) delete payload.firstName;
                        if (!payload.lastName) delete payload.lastName;

                        if (payload.ccInfo && typeof payload.ccInfo === 'object') {
                            const cc = payload.ccInfo as Record<string, string>;
                            if (cc.ccNumber) cc.ccNumber = cc.ccNumber.replace(/-/g, '');
                            if (!cc.ccNumber && !cc.ccExpiry && !cc.ccCvc) delete payload.ccInfo;
                        }

                        update.mutate(payload, { onSuccess: () => nav('/dashboard') });
                    }}
                >
                    {({ errors, touched, values, setFieldValue }) => (
                        <Form>
                            {/* Username & names */}
                            <Field
                                as={TextField}
                                fullWidth
                                margin="dense"
                                label="Username"
                                name="username"
                                error={touched.username && !!errors.username}
                                helperText={touched.username && (errors.username as string)}
                            />

                            <Field
                                as={TextField}
                                fullWidth
                                margin="dense"
                                label="First Name"
                                name="firstName"
                                error={touched.firstName && !!errors.firstName}
                                helperText={touched.firstName && (errors.firstName as string)}
                            />

                            <Field
                                as={TextField}
                                fullWidth
                                margin="dense"
                                label="Last Name"
                                name="lastName"
                                error={touched.lastName && !!errors.lastName}
                                helperText={touched.lastName && (errors.lastName as string)}
                            />

                            {/* Email & password */}
                            <Field
                                as={TextField}
                                fullWidth
                                margin="dense"
                                label="Email"
                                name="email"
                                error={touched.email && !!errors.email}
                                helperText={touched.email && (errors.email as string)}
                            />
                            <Field
                                as={TextField}
                                fullWidth
                                margin="dense"
                                label="Password"
                                name="password"
                                type="password"
                                error={touched.password && !!errors.password}
                                helperText={touched.password && (errors.password as string)}
                            />

                            {/* Credit‑card inputs */}
                            <TextField
                                fullWidth
                                margin="dense"
                                label="Card Number"
                                name="ccInfo.ccNumber"
                                value={values.ccInfo?.ccNumber || ''}
                                onChange={(e) => setFieldValue('ccInfo.ccNumber', formatCreditCard(e.target.value))}
                                inputProps={{ maxLength: 19 }}
                                error={touched.ccInfo?.ccNumber && !!(errors as any).ccInfo?.ccNumber}
                                helperText={touched.ccInfo?.ccNumber && (errors as any).ccInfo?.ccNumber}
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                label="Expiration (MM/YY)"
                                name="ccInfo.ccExpiry"
                                value={values.ccInfo?.ccExpiry || ''}
                                onChange={(e) => setFieldValue('ccInfo.ccExpiry', formatExpiryDate(e.target.value))}
                                inputProps={{ maxLength: 5 }}
                                error={touched.ccInfo?.ccExpiry && !!(errors as any).ccInfo?.ccExpiry}
                                helperText={touched.ccInfo?.ccExpiry && (errors as any).ccInfo?.ccExpiry}
                            />
                            <Field
                                as={TextField}
                                fullWidth
                                margin="dense"
                                label="CVC"
                                name="ccInfo.ccCvc"
                                inputProps={{ maxLength: 4 }}
                                error={touched.ccInfo?.ccCvc && !!(errors as any).ccInfo?.ccCvc}
                                helperText={touched.ccInfo?.ccCvc && (errors as any).ccInfo?.ccCvc}
                            />

                            {/* Actions */}
                            <Button sx={{ mt: 2 }} variant="contained" type="submit" disabled={update.isPending}>
                                Save
                            </Button>
                            <Button sx={{ mt: 2, ml: 2 }} onClick={() => nav('/dashboard')} disabled={update.isPending}>
                                Cancel
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Box>
    );
}