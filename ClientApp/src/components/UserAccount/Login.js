import React, {Component} from 'react';
import TextInputLiveFeedback from "../utils/TextInputLiveFeedback";
import * as yup from "yup";
import {useNavigate} from "react-router-dom";
import {FormikProvider, useFormik} from "formik";
import {Button, Col, Form, FormGroup} from "reactstrap";
import {FormControl, InputAdornment, InputLabel, ListSubheader, MenuItem, Select, TextField} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";

const validationSchema = yup.object({
    email: yup
        .string()
        .email('Invalid email format.')
        .required('Email is required'),
    password: yup
        .string()
        .required('Password is required')
});

function Login() {

    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);


    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            userName: '',
            phoneNumber: ''
        },
        validationSchema: validationSchema,
        validateOnChange: false,
        validateOnMount: true,
        onSubmit: (values) => {
            fetch(`${process.env.REACT_APP_AUTH_API_URL}/Login`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Email: values.email,
                    Password: values.password
                })
            })
                .then(async res => {
                    res = await res.json();
                    if (res) {
                        navigate("/login2factor", {
                            state: {
                                Email: values.email,
                                Password: values.password
                            }
                        });
                    }
                })
                .catch(err => {
                    console.error("Error logging in:", err);
                });
        },
    });
    return (
        <>
            <h2 style={{textAlign: 'center'}}>Welcome to CarSharing!</h2>
            <hr/>
            <h5 style={{textAlign: 'center'}}>Create an account</h5>
            <div className="row">
                <Col md={4}>
                    <FormikProvider value={formik}>
                        <Form onSubmit={formik.handleSubmit}>
                            <TextInputLiveFeedback
                                label="Email"
                                id="email"
                                name="email"
                                onChange={formik.handleChange}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helpertext={formik.touched.email && formik.errors.email}
                                type="text"
                                variant="text"
                            />
                            <TextInputLiveFeedback
                                label="Password"
                                required
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                inputName="Password"
                                name="password"
                                onChange={formik.handleChange}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helpertext={formik.touched.password && formik.errors.password}
                                variant="outlined"
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            <div className="buttonHolder">
                                <Button variant="primary" type="submit">
                                    Login
                                </Button>
                            </div>
                        </Form>
                    </FormikProvider>
                </Col>
            </div>
        </>
    );
}

export default Login;