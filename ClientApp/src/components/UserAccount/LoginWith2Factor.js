import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FormikProvider, useFormik } from "formik";
import { Button, Col, Form, FormGroup } from "reactstrap";
import TextInputLiveFeedback from "../utils/TextInputLiveFeedback";
import { Box, FormControl } from "@mui/material";
import * as yup from "yup";

const validationSchema = yup.object({
    inputCode: yup
        .string()
        .required('The Input Code is required')
});

function LoginWith2Factor() {
    const { state } = useLocation();
    const { Email, Password } = state;
    const [img, setImg] = useState('');
    const [key, setKey] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchImage() {
            try {
                const res = await fetch(`${process.env.REACT_APP_AUTH_API_URL}/GetImage?Email=${Email}`);
                if (!res.ok) throw new Error("Failed to fetch image");
                const imageModel = await res.json();
                setImg(imageModel.barcodeImageUrl);
                setKey(imageModel.key);
            } catch (error) {
                console.error("Error fetching image:", error);
            }
        }

        fetchImage();
    }, [Email]);

    const formik = useFormik({
        initialValues: {
            inputCode: ''
        },
        validationSchema: validationSchema,
        validateOnChange: false,
        validateOnMount: true,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                const res = await fetch(`${process.env.REACT_APP_AUTH_API_URL}/Login2FactorPost`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        Email: Email,
                        Password: Password,
                        Key: key,
                        InputCode: values.inputCode
                    })
                });
                if(res.ok) {
                    const {token} = await res.json();

                    // Salvăm token-ul JWT în localStorage
                    localStorage.setItem("jwtToken", token);
                    navigate("/home");
                }
            } catch (error) {
                console.error("Error during login:", error);
            }
        },
    });

    return (
        <div className="row">
            <Col md={4}>
                <FormikProvider value={formik}>
                    <Form onSubmit={formik.handleSubmit}>
                        <FormGroup className="form-group">
                            <FormControl fullWidth>
                                <Box
                                    component="img"
                                    sx={{
                                        width: '300px',
                                        height: '300px',
                                        justifyContent: 'center',
                                    }}
                                    alt="QR Code."
                                    src={img}
                                />
                            </FormControl>
                        </FormGroup>
                        <TextInputLiveFeedback
                            label="Input Code"
                            id="inputCode"
                            name="inputCode"
                            onChange={formik.handleChange}
                            error={formik.touched.inputCode && Boolean(formik.errors.inputCode)}
                            helpertext={formik.touched.inputCode && formik.errors.inputCode}
                            type="text"
                            variant="text"
                        />
                        <div className="buttonHolder">
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </div>
                    </Form>
                </FormikProvider>
            </Col>
        </div>
    );
}

export default LoginWith2Factor;
