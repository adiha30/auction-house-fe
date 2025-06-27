import {Box, Button, Paper, TextField, Typography} from '@mui/material';
import {Field, Form, Formik} from 'formik';
import * as Yup from 'yup';
import {useCurrentUser} from '../hooks/useCurrentUser';
import {useUpdateUser} from '../hooks/useUpdateUser';
import {useNavigate} from 'react-router-dom';
import {User} from "../api/userApi.ts";

const schema = Yup.object({
    username: Yup.string().min(3).max(20).required(),
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

function formatCreditCard(value: string): string {
    const digits = value.replace(/\D/g, '');
    const parts = [];
    for (let i = 0; i < digits.length; i += 4) {
        parts.push(digits.substring(i, i + 4));
    }
    return parts.join('-');
}

function formatExpiryDate(value: string): string {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
}

interface EditProfileFormProps {
    userToEdit: User;
    currentUser: User;
    onSave: () => void;
    onCancel: () => void;
}

export function EditProfileForm({userToEdit, currentUser, onSave, onCancel}: EditProfileFormProps) {
    const update = useUpdateUser();
    const isCurrentUserAdmin = currentUser?.role === 'ADMIN';

    const initial = {
        username: userToEdit.username,
        email: userToEdit.email,
        password: '',
        ccInfo: {
            ccNumber: userToEdit.ccInfo?.ccNumber ? formatCreditCard(userToEdit.ccInfo.ccNumber) : '',
            ccExpiry: userToEdit.ccInfo?.ccExpiry ?? '',
            ccCvc: userToEdit.ccInfo?.ccCvc ?? ''
        },
    };

    return (
        <Formik
            initialValues={initial}
            validationSchema={schema}
            onSubmit={(values) => {
                const payload: any = {...values};

                if (isCurrentUserAdmin && userToEdit.userId !== currentUser.userId) {
                    payload.userId = userToEdit.userId;
                }

                if (!payload.password) {
                    delete payload.password;
                }

                if (!isCurrentUserAdmin) {
                    if (payload.ccInfo?.ccNumber) {
                        payload.ccInfo.ccNumber = payload.ccInfo.ccNumber.replace(/-/g, '');
                    } else {
                        delete payload.ccInfo;
                    }
                } else {
                    delete payload.ccInfo;
                }

                update.mutate(payload, {onSuccess: onSave});
            }}
        >
            {({errors, touched, values, setFieldValue}) => (
                <Form>
                    <Field as={TextField} fullWidth margin="dense" label="Username" name="username"
                           error={touched.username && !!errors.username}
                           helperText={touched.username && errors.username}/>
                    <Field as={TextField} fullWidth margin="dense" label="Email" name="email"
                           error={touched.email && !!errors.email} helperText={touched.email && errors.email}/>
                    <Field as={TextField} fullWidth margin="dense" label="Password" name="password" type="password"
                           error={touched.password && !!errors.password}
                           helperText={touched.password && errors.password}/>
                    {!isCurrentUserAdmin && (
                        <>
                            <TextField fullWidth margin="dense" label="Card Number" name="ccInfo.ccNumber"
                                       value={values.ccInfo?.ccNumber || ''}
                                       onChange={(e) => setFieldValue('ccInfo.ccNumber', formatCreditCard(e.target.value))}
                                       inputProps={{maxLength: 19}}
                                       error={touched.ccInfo?.ccNumber && !!errors.ccInfo?.ccNumber}
                                       helperText={touched.ccInfo?.ccNumber && errors.ccInfo?.ccNumber}/>
                            <TextField fullWidth margin="dense" label="Expiration Date (MM/YY)" name="ccInfo.ccExpiry"
                                       value={values.ccInfo?.ccExpiry || ''}
                                       onChange={(e) => setFieldValue('ccInfo.ccExpiry', formatExpiryDate(e.target.value))}
                                       inputProps={{maxLength: 5}}
                                       error={touched.ccInfo?.ccExpiry && !!errors.ccInfo?.ccExpiry}
                                       helperText={touched.ccInfo?.ccExpiry && errors.ccInfo?.ccExpiry}/>
                            <Field as={TextField} fullWidth margin="dense" label="CVC" name="ccInfo.ccCvc"
                                   inputProps={{maxLength: 4}}
                                   error={touched.ccInfo?.ccCvc && !!errors.ccInfo?.ccCvc}
                                   helperText={touched.ccInfo?.ccCvc && errors.ccInfo?.ccCvc}/>
                        </>
                    )}
                    <Button sx={{mt: 2}} variant="contained" type="submit" disabled={update.isPending}>Save</Button>
                    <Button sx={{mt: 2, ml: 2}} onClick={onCancel}>Cancel</Button>
                </Form>
            )}
        </Formik>
    );
}

export default function EditProfilePage() {
    const {data: user} = useCurrentUser();
    const nav = useNavigate();

    if (!user) return null;

    return (
        <Box mt={4} display="flex" justifyContent="center">
            <Paper sx={{p: 4, width: 400}}>
                <Typography variant="h5" mb={2}>Edit Profile</Typography>
                <EditProfileForm
                    userToEdit={user}
                    currentUser={user}
                    onSave={() => nav('/dashboard')}
                    onCancel={() => nav('/dashboard')}
                />
            </Paper>
        </Box>
    );
}