// src/pages/CreateListingPage.tsx
import {Box, Button, Checkbox, FormControlLabel, IconButton, Paper, Stack, TextField, Typography,} from '@mui/material';
import Grid from '@mui/material/Grid';
import {Clear as ClearIcon} from '@mui/icons-material';
import {Field, FieldProps, Form, Formik} from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import {useMemo, useState} from 'react';

import {useCategoryMetadata} from '../hooks/useCategoryMetadata';
import {useCreateListing} from '../hooks/useCreateListing';
import {useUploadImage} from '../hooks/useUploadImage';
import type {FieldMetadata} from '../api/categoryApi';

export const pretty = (s: string) =>
    s
        .toLowerCase()
        .split(/[_\s]+/)
        .map(w => w[0].toUpperCase() + w.slice(1))
        .join(' ');

function DynamicField({meta}: { meta: FieldMetadata }) {
    return (
        <Field name={`extra.${meta.name}`}>
            {({field, form, meta: m}: FieldProps) =>
                meta.type === 'boolean' ? (
                    <FormControlLabel
                        control={
                            <Checkbox
                                {...field}
                                checked={Boolean(field.value)}
                                onChange={e => form.setFieldValue(field.name, e.target.checked)}
                            />
                        }
                        label={pretty(meta.name)}
                    />
                ) : (
                    <TextField
                        {...field}
                        label={pretty(meta.name)}
                        fullWidth
                        margin="dense"
                        error={m.touched && !!m.error}
                        helperText={m.touched && m.error ? String(m.error) : undefined}
                    />
                )
            }
        </Field>
    );
}

export default function CreateListingPage({
                                              initialCategory,
                                          }: {
    initialCategory: string;
}) {
    const create = useCreateListing();
    const {mutate: uploadImages, isPending: uploading} = useUploadImage();

    const {data: meta} = useCategoryMetadata(initialCategory);
    const [images, setImages] = useState<string[]>([]);

    /* ---------- validation schema ---------- */
    const schema = useMemo(() => {
        const base: Record<string, Yup.AnySchema> = {
            title: Yup.string().min(3).max(60).required(),
            description: Yup.string().min(10).max(1000).required(),
            startPrice: Yup.number().positive().required(),
            buyNowPrice: Yup.number()
                .transform(v => (isNaN(v) ? undefined : v))
                .moreThan(Yup.ref('startPrice'), 'Must exceed start price')
                .optional(),
            duration: Yup.string().required(),
        };

        meta?.requiredFields.forEach(f => {
            base[`extra.${f.name}`] =
                f.type === 'boolean' ? Yup.boolean().required() : Yup.string().required();
        });

        return Yup.object(base);
    }, [meta]);

    const durationOptions: Record<string, number> = {
        '4 h': 4,
        '12 h': 12,
        '24 h': 24,
        '3 d': 72,
        '1 w': 24 * 7,
        '2 w': 24 * 14,
    };

    /* ---------- UI ---------- */
    return (
        <Box mt={4} display="flex" justifyContent="center">
            <Paper sx={{p: 4, width: 640}}>
                <Typography variant="h5" mb={2}>
                    New Listing – {pretty(initialCategory)}
                </Typography>

                <Formik
                    enableReinitialize
                    initialValues={{
                        title: '',
                        description: '',
                        startPrice: 1,
                        buyNowPrice: undefined,
                        duration: '24 h',
                        extra:
                            meta?.requiredFields.reduce((acc, f) => {
                                acc[f.name] = f.type === 'boolean' ? false : '';
                                return acc;
                            }, {} as Record<string, unknown>) || {},
                    }}
                    validationSchema={schema}
                    onSubmit={({extra, duration, ...base}) => {
                        const endTime = dayjs()
                            .add(durationOptions[duration], 'hour')
                            .toISOString();
                        create.mutate({
                            ...base,
                            ...extra,
                            category: initialCategory,
                            endTime,
                            images,
                        });
                    }}
                >
                    {({touched, errors, isValid}) => (
                        <Form>
                            <Stack spacing={2}>
                                <Field
                                    as={TextField}
                                    name="title"
                                    label="Title"
                                    fullWidth
                                    error={touched.title && !!errors.title}
                                    helperText={
                                        touched.title && errors.title ? String(errors.title) : undefined
                                    }
                                />

                                {meta?.requiredFields.map(f => (
                                    <DynamicField key={f.name} meta={f}/>
                                ))}

                                <Field
                                    as={TextField}
                                    multiline
                                    rows={3}
                                    name="description"
                                    label="Description"
                                    fullWidth
                                    error={touched.description && !!errors.description}
                                    helperText={
                                        touched.description && errors.description
                                            ? String(errors.description)
                                            : undefined
                                    }
                                />

                                <Stack direction="row" spacing={2}>
                                    <Field
                                        as={TextField}
                                        type="number"
                                        name="startPrice"
                                        label="Start $"
                                        sx={{flex: 1}}
                                        error={touched.startPrice && !!errors.startPrice}
                                        helperText={
                                            touched.startPrice && errors.startPrice
                                                ? String(errors.startPrice)
                                                : undefined
                                        }
                                    />
                                    <Field
                                        as={TextField}
                                        type="number"
                                        name="buyNowPrice"
                                        label="Buy-Now $ (optional)"
                                        sx={{flex: 1}}
                                        error={touched.buyNowPrice && !!errors.buyNowPrice}
                                        helperText={
                                            touched.buyNowPrice && errors.buyNowPrice
                                                ? String(errors.buyNowPrice)
                                                : undefined
                                        }
                                    />
                                </Stack>

                                <Field name="duration">
                                    {({field}: FieldProps) => (
                                        <TextField select label="Auction length" fullWidth {...field}>
                                            {Object.keys(durationOptions).map(opt => (
                                                <MenuItem key={opt} value={opt}>
                                                    {opt}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                </Field>

                                {/* ---------- images ---------- */}
                                <Stack spacing={1}>
                                    <Button variant="outlined" component="label" disabled={uploading}>
                                        {uploading ? 'Uploading…' : 'Add images'}
                                        <input
                                            hidden
                                            multiple
                                            type="file"
                                            accept="image/*"
                                            onChange={e => {
                                                const files = Array.from(e.target.files ?? []);
                                                if (!files.length) return;
                                                uploadImages(files, {
                                                    onSuccess: urls => setImages(prev => [...prev, ...urls]),
                                                });
                                            }}
                                        />
                                    </Button>

                                    <Grid container spacing={1}>
                                        {images.map(url => (
                                            <Grid item xs={4} key={url}>
                                                <Box sx={{position: 'relative'}}>
                                                    <img
                                                        src={url}
                                                        alt="preview"
                                                        width={128}
                                                        height={128}
                                                        style={{objectFit: 'cover', borderRadius: 8}}
                                                    />
                                                    <IconButton
                                                        size="small"
                                                        onClick={() =>
                                                            setImages(imgs => imgs.filter(u => u !== url))
                                                        }
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 2,
                                                            right: 2,
                                                            bgcolor: 'white',
                                                        }}
                                                    >
                                                        <ClearIcon fontSize="small"/>
                                                    </IconButton>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Stack>

                                <Button
                                    variant="contained"
                                    type="submit"
                                    disabled={create.isPending || uploading || !isValid}
                                >
                                    {create.isPending ? 'Publishing…' : 'Publish'}
                                </Button>
                            </Stack>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Box>
    );
}
