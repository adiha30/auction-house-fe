// src/pages/CreateListingPage.tsx
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    IconButton,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
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
import {API_URL} from '../api/config';
import {deleteImage, uploadsPath} from "../api/listingApi.ts";

export const pretty = (s: string) =>
    s
        .toLowerCase()
        .split(/[_\s]+/)
        .map((w) => w[0].toUpperCase() + w.slice(1))
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
                                onChange={(e) =>
                                    form.setFieldValue(field.name, e.target.checked)
                                }
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
    const [imageIds, setImageIds] = useState<string[]>([]);

    /* ---------- validation schema ---------- */
    const schema = useMemo(() => {
        // Base schema for top-level fields
        const baseSchema = {
            title: Yup.string().min(3).max(60).required(),
            description: Yup.string().min(10).max(1000).required(),
            startPrice: Yup.number().positive().required(),
            buyNowPrice: Yup.number()
                .transform((v) => (isNaN(v) ? undefined : v))
                .moreThan(Yup.ref('startPrice'), 'Must exceed start price')
                .optional(),
            duration: Yup.string().required(),
        };

        // Nested schema for extra fields
        const extraFields: Record<string, Yup.AnySchema> = {};
        meta?.requiredFields.forEach((f) => {
            extraFields[f.name] =
                f.type === 'boolean' ? Yup.boolean().required() : Yup.string().required();
        });

        return Yup.object({
            ...baseSchema,
            extra: Yup.object(extraFields).required(),
        });
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
                    onSubmit={({extra, duration, buyNowPrice, ...base}) => {
                        const endTime = dayjs()
                            .add(durationOptions[duration], 'hour')
                            .toISOString();
                        const payload = {
                            ...base,
                            ...extra,
                            categoryName: initialCategory,
                            endTime,
                            imageIds: imageIds,
                        };

                        if (buyNowPrice !== undefined && buyNowPrice !== '') {
                            // @ts-expect-error
                            payload.buyNowPrice = Number(buyNowPrice);
                        }

                        create.mutate(payload);
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
                                        touched.title && errors.title
                                            ? String(errors.title)
                                            : undefined
                                    }
                                />

                                {meta?.requiredFields.map((f) => (
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
                                            {Object.keys(durationOptions).map((opt) => (
                                                <MenuItem key={opt} value={opt}>
                                                    {opt}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                </Field>

                                {/* ---------- images ---------- */}
                                <Stack spacing={1}>
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        disabled={uploading}
                                    >
                                        {uploading ? 'Uploading…' : 'Add images'}
                                        <input
                                            hidden
                                            multiple
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files ?? []);
                                                if (!files.length) return;
                                                uploadImages(files, {
                                                    onSuccess: (ids) =>
                                                        setImageIds((prev) => [...prev, ...ids]),
                                                });
                                            }}
                                        />
                                    </Button>

                                    <Grid container spacing={1}>
                                        {imageIds.map((id) => {
                                            const uploadsEndpoint = `${API_URL}${uploadsPath}/`;

                                            return (
                                                <Grid component="div" size={{xs: 4}} key={id}>
                                                    <Box sx={{position: 'relative'}}>
                                                        <img
                                                            src={`${uploadsEndpoint}${id}`}
                                                            alt="preview"
                                                            width={128}
                                                            height={128}
                                                            style={{objectFit: 'cover', borderRadius: 8}}
                                                        />
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => {
                                                                setImageIds((imgs) => imgs.filter((u) => u !== id));

                                                                const imageId = id.includes('/uploads/') ?
                                                                    id.split('/uploads/')[1] :
                                                                    id;
                                                                deleteImage(imageId);
                                                            }
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
                                            );
                                        })}
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
