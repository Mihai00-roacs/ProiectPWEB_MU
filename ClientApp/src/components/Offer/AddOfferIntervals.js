import dayjs from 'dayjs';
import React, {useEffect, useMemo} from "react";
import {FormikProvider, useFormik} from "formik";
import {Button, Col, Form} from "reactstrap";
import debounce from "lodash/debounce";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import TextInputLiveFeedback from "../utils/TextInputLiveFeedback";
import {useLocation} from "react-router-dom";
import * as yup from "yup";
import { parse, isDate } from "date-fns";

function parseDateString(value, originalValue) {
    return isDate(originalValue)
        ? originalValue
        : parse(originalValue, "yyyy-MM-dd", new Date());
}
function AddOfferIntervals() {

    const {state} = useLocation();
    const {OfferId} = state;
    const today = (new Date()).toISOString().split('T')[0];
    const validationSchema = yup.object({
        startDate: yup
            .date()
            .transform(parseDateString)
            .min(today)
            .required('Milleage is required'),
        endDate: yup
            .date()
            .transform(parseDateString)
            .min(yup.ref('startDate'))
            .required('Description is required'),
    });
    const formik = useFormik({
        initialValues: {
            startDate: today,
            endDate: today,
            offerId: OfferId
        },
        validationSchema: validationSchema,
        validateOnChange: false,
        validateOnMount: true,
        onSubmit: (values) => {
            fetch('https://localhost:44417/offers/addOfferIntervals', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        OfferId: OfferId,
                        StartDate: values.startDate+"T00:00",
                        EndDate: values.endDate+"T00:00"
                    }
                )
            }).then(async res => {
                res = await res.json();
            });
        },
    });
    const debouncedValidate = useMemo(
        () => debounce(formik.validateForm, 500),
        [formik.validateForm],
    );

    useEffect(
        () => {
            debouncedValidate(formik.values);
        },
        [formik.values, debouncedValidate],
    );
    return (
        <div>
            <Col md={4}>
                <FormikProvider value={formik}>
                    <Form onSubmit={formik.handleSubmit}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TextInputLiveFeedback
                                label="StartDate"
                                id="startDate"
                                name="startDate"
                                onChange={formik.handleChange}
                                error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                                helpertext={formik.touched.startDate && formik.errors.startDate}
                                type="date"
                            />
                            <TextInputLiveFeedback
                                label="EndDate"
                                id="enDate"
                                name="endDate"
                                onChange={formik.handleChange}
                                error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                                helpertext={formik.touched.endDate && formik.errors.endDate}
                                type="date"
                            />
                        </LocalizationProvider>
                        <div className="buttonHolder">
                            <Button variant="primary" type="submit">
                                Sign Up
                            </Button>
                        </div>
                    </Form>
                </FormikProvider>
            </Col>
        </div>
    );
}

export default AddOfferIntervals;