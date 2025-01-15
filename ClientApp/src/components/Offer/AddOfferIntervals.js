import React, { useEffect, useMemo, useState } from "react";
import { FormikProvider, useFormik } from "formik";
import { Button, Col, Form } from "reactstrap";
import debounce from "lodash/debounce";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextInputLiveFeedback from "../utils/TextInputLiveFeedback";
import { useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { parse, isDate } from "date-fns";
import { Box, Card, CardContent, CardActions, Typography, Grid } from "@mui/material";

function parseDateString(value, originalValue) {
    return isDate(originalValue)
        ? originalValue
        : parse(originalValue, "yyyy-MM-dd", new Date());
}

function AddOfferIntervals() {
    const { state } = useLocation();
    const { OfferId } = state;
    const navigate = useNavigate();

    const [intervalAdded, setIntervalAdded] = useState(false);

    const today = new Date().toISOString().split("T")[0];
    const validationSchema = yup.object({
        startDate: yup.date().transform(parseDateString).min(today).required("Start Date is required"),
        endDate: yup.date().transform(parseDateString).min(yup.ref("startDate")).required("End Date is required"),
    });

    const formik = useFormik({
        initialValues: {
            startDate: today,
            endDate: today,
            offerId: OfferId,
        },
        validationSchema,
        validateOnChange: false,
        validateOnMount: true,
        onSubmit: (values) => {
            fetch("https://localhost:44417/offers/addOfferIntervals", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    OfferId: OfferId,
                    StartDate: values.startDate + "T00:00",
                    EndDate: values.endDate + "T00:00",
                }),
            })
                .then(async (res) => {
                    const result = await res.json();
                    if (res.ok) {
                        setIntervalAdded(true);
                    }
                })
                .catch((err) => console.error(err));
        },
    });

    const debouncedValidate = useMemo(() => debounce(formik.validateForm, 500), [formik.validateForm]);

    useEffect(() => {
        debouncedValidate(formik.values);
    }, [formik.values, debouncedValidate]);

    return (
        <Box sx={{ p: 4 }}>
            <Card sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
                <CardContent>
                    <Typography variant="h5" align="center" gutterBottom>
                        Add Offer Intervals
                    </Typography>
                    <FormikProvider value={formik}>
                        <Form onSubmit={formik.handleSubmit}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextInputLiveFeedback
                                            label="Start Date"
                                            id="startDate"
                                            name="startDate"
                                            onChange={formik.handleChange}
                                            error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                                            helpertext={formik.touched.startDate && formik.errors.startDate}
                                            type="date"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextInputLiveFeedback
                                            label="End Date"
                                            id="endDate"
                                            name="endDate"
                                            onChange={formik.handleChange}
                                            error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                                            helpertext={formik.touched.endDate && formik.errors.endDate}
                                            type="date"
                                        />
                                    </Grid>
                                </Grid>
                            </LocalizationProvider>
                            <CardActions sx={{ justifyContent: "center", mt: 2 }}>
                                <Button variant="contained" color="primary" type="submit">
                                    Add Interval
                                </Button>
                            </CardActions>
                        </Form>
                    </FormikProvider>
                    {intervalAdded && (
                        <Box sx={{ textAlign: "center", mt: 4 }}>
                            <Typography variant="h6" color="success.main">
                                Interval Added Successfully!
                            </Typography>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => navigate("/")}
                                sx={{ mt: 2 }}
                            >
                                Go to Home
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}

export default AddOfferIntervals;