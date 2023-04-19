import React, {useEffect, useMemo, useState} from "react";
import AvailableIntervalsDataTable from "./AvailableIntervalsDataTable";
import UnAvailableIntervalsDataTable from "./UnAvailableIntervalsDataTable";
import {Button, Col, Form} from "reactstrap";
import {FormikProvider, useFormik} from "formik";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import TextInputLiveFeedback from "../utils/TextInputLiveFeedback";
import {isDate, parse} from "date-fns";
import * as yup from "yup";
import debounce from "lodash/debounce";
import {useLocation, useParams} from "react-router-dom";
function parseDateString(value, originalValue) {
    return isDate(originalValue)
        ? originalValue
        : parse(originalValue, "yyyy-MM-dd", new Date());
}
function SendRequest(){
    let {id} = useParams();
    const today = (new Date()).toISOString().split('T')[0];
    const [availableIntervals, setAvailableIntervals] = useState(null);
    const [unAvailableIntervals, setUnavailableIntervals] = useState(null);
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
            offerId: id
        },
        validationSchema: validationSchema,
        validateOnChange: false,
        validateOnMount: true,
        onSubmit: (values) => {
            fetch('https://localhost:44417/requests/sendRequest', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        OfferId: id,
                        StartDate: values.startDate+"T00:00",
                        EndDate: values.endDate+"T00:00",
                        AvailableIntervals:availableIntervals,
                        UnavailableIntervals:unAvailableIntervals
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
    <>
        <h2 style={{textAlign: 'center'}}>Welcome to CarSharing!</h2>
        <hr/>
        <h5 style={{textAlign: 'center'}}>Send Request</h5>
        <hr/>
        <h1 style={{textAlign: 'center'}}>Available intervals</h1>
        <AvailableIntervalsDataTable id={id} setAvailableIntervals={setAvailableIntervals}></AvailableIntervalsDataTable>
        <hr/>
        <h2 style={{textAlign: 'center'}}>Taken intervals by other users</h2>
        <UnAvailableIntervalsDataTable id={id} setUnavailableIntervals={setUnavailableIntervals} ></UnAvailableIntervalsDataTable>
        <hr />
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
                                Send Request
                            </Button>
                        </div>
                    </Form>
                </FormikProvider>
            </Col>
        </div>
    </>
)
}
export default SendRequest;