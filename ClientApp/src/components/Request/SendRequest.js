// src/pages/SendRequest.jsx
import React, { useEffect, useMemo, useState } from "react";
import AvailableIntervalsDataTable from "./AvailableIntervalsDataTable";
import UnAvailableIntervalsDataTable from "./UnAvailableIntervalsDataTable";
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Grid,
    Typography,
} from "@mui/material";
import { FormikProvider, useFormik } from "formik";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextInputLiveFeedback from "../utils/TextInputLiveFeedback";
import { isDate, parse } from "date-fns";
import * as yup from "yup";
import debounce from "lodash/debounce";
import { useParams } from "react-router-dom";
import {useAuth} from "../Authentication/Auth";

function parseDateString(value, originalValue) {
    return isDate(originalValue)
        ? originalValue
        : parse(originalValue, "yyyy-MM-dd", new Date());
}

function SendRequest() {
    let { id } = useParams();
    const {userId} = useAuth();
    const today = new Date().toISOString().split("T")[0];
    const [availableIntervals, setAvailableIntervals] = useState(null);
    const [unAvailableIntervals, setUnavailableIntervals] = useState(null);

    const validationSchema = yup.object({
        startDate: yup
            .date()
            .transform(parseDateString)
            .min(today, "Start Date cannot be in the past")
            .required("Start Date is required"),
        endDate: yup
            .date()
            .transform(parseDateString)
            .min(yup.ref("startDate"), "End Date cannot be before Start Date")
            .required("End Date is required"),
    });

    const formik = useFormik({
        initialValues: {
            startDate: today,
            endDate: today,
            offerId: id,
        },
        validationSchema: validationSchema,
        validateOnChange: false,
        validateOnMount: true,
        onSubmit: (values) => {
            fetch("https://localhost:44417/requests/sendRequest/?userId="+userId, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    OfferId: id,
                    StartDate: values.startDate + "T00:00",
                    EndDate: values.endDate + "T00:00",
                    AvailableIntervals: availableIntervals,
                    UnavailableIntervals: unAvailableIntervals,
                }),
            }).then(async (res) => {
                res = await res.json();
            });
        },
    });

    const debouncedValidate = useMemo(
        () => debounce(formik.validateForm, 500),
        [formik.validateForm]
    );

    useEffect(() => {
        debouncedValidate(formik.values);
    }, [formik.values, debouncedValidate]);

    return (
        <Box
            sx={{
                p: 3,
                minHeight: "100vh",
                background: "linear-gradient(to right, #4e54c8, #8f94fb)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Card
                sx={{
                    width: "70%",
                    p: 4,
                    borderRadius: 4,
                    boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)",
                    background: "rgba(255, 255, 255, 0.9)",
                }}
            >
                <Typography
                    align="center"
                    variant="h4"
                    gutterBottom
                    sx={{ color: "#4e54c8", fontWeight: "bold" }}
                >
                    Welcome to CarSharing!
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Typography align="center" variant="h5" gutterBottom>
                    Send Request
                </Typography>

                <Grid container spacing={3} sx={{ mt: 2 }}>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Available Intervals
                        </Typography>
                        <AvailableIntervalsDataTable
                            id={id}
                            setAvailableIntervals={setAvailableIntervals}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Taken Intervals by Other Users
                        </Typography>
                        <UnAvailableIntervalsDataTable
                            id={id}
                            setUnavailableIntervals={setUnavailableIntervals}
                        />
                    </Grid>
                </Grid>

                <FormikProvider value={formik}>
                    <form onSubmit={formik.handleSubmit}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Box sx={{ mt: 3 }}>
                                <TextInputLiveFeedback
                                    label="Start Date"
                                    id="startDate"
                                    name="startDate"
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.startDate &&
                                        Boolean(formik.errors.startDate)
                                    }
                                    helperText={
                                        formik.touched.startDate &&
                                        formik.errors.startDate
                                    }
                                    type="date"
                                />
                                <TextInputLiveFeedback
                                    label="End Date"
                                    id="endDate"
                                    name="endDate"
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.endDate &&
                                        Boolean(formik.errors.endDate)
                                    }
                                    helperText={
                                        formik.touched.endDate &&
                                        formik.errors.endDate
                                    }
                                    type="date"
                                />
                            </Box>
                        </LocalizationProvider>

                        <Box
                            sx={{
                                mt: 4,
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{
                                    backgroundColor: "#4e54c8",
                                    "&:hover": { backgroundColor: "#373ccd" },
                                }}
                            >
                                Send Request
                            </Button>
                        </Box>
                    </form>
                </FormikProvider>
            </Card>
        </Box>
    );
}

export default SendRequest;
