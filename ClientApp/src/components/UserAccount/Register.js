import React, {useEffect, useState} from "react";
import {Button, Col, Form, FormGroup} from 'reactstrap';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SearchIcon from "@mui/icons-material/Search";
import {FormikProvider, useFormik} from 'formik';
import * as yup from 'yup';
import {FormControl, InputAdornment, InputLabel, ListSubheader, MenuItem, Select, TextField} from "@mui/material";
import {useNavigate} from "react-router-dom";
import TextInputLiveFeedback from "../utils/TextInputLiveFeedback";



const validationSchema = yup.object({
    email: yup
        .string()
        .email("Invalid email format.")
        .required("Email is required")
        .test(
            "checkEmailUnique",
            "This email is already registered",
            async function (value) {
                const res = await fetch(
                    `${process.env.REACT_APP_AUTH_API_URL}/emailAvailability?email=${value}`
                );
                return res.ok && (await res.json());
            }
        ),
    password: yup
        .string()
        .min(8, "Password should be of minimum 8 characters length")
        .matches(
            /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{10,}$/,
            "The Password must have at least one numeric, one special character, one uppercase letter, and be at least 10 characters long."
        )
        .required("Password is required"),
    confirmPassword: yup
        .string()
        .when("password", (password, schema) => {
            return schema.test({
                test: (confirmPassword) => password[0] === confirmPassword,
                message: "The passwords must match",
            });
        }),
    firstName: yup
        .string()
        .matches(/^[a-zA-Z]*( [a-zA-Z]+)*$/, "First name must contain only letters.")
        .required("First name is required"),
    lastName: yup
        .string()
        .matches(/^[a-zA-Z]*$/, "Last name must contain only letters.")
        .required("Last name is required"),
    userName: yup
        .string()
        .min(5, "Username must be at least 5 characters long")
        .matches(/^[a-zA-Z0-9]*$/, "Username must not contain special characters.")
        .test(
            "checkUserNameUnique",
            "This username is already registered",
            async function (value) {
                const res = await fetch(
                    `${process.env.REACT_APP_AUTH_API_URL}/userAvailability?userName=${value}`
                );
                return res.ok && (await res.json());
            }
        )
        .required("Username is required"),
    phoneNumber: yup
        .string()
        .matches(/^[0-9]+$/, "Phone number must contain only digits.")
        .required("Phone number is required"),
});

function Register() {
    const [cityId, setCity] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [displayCities, setDisplayCities] = useState([]);

    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleChange = (event) => {
        setCity(event.target.value);
    };

    const getCities = async (search) => {
        if (search !== "") {
            const res = await fetch(
                `${process.env.REACT_APP_AUTH_API_URL}/GetCities?search=${search}`
            );
            return await res.json();
        }
    };

    useEffect(() => {
        async function fetchData() {
            const cities = await getCities(searchText);
            if (cities) {
                setDisplayCities(
                    cities.map((result) => ({
                        value: result.value,
                        text: result.text,
                    }))
                );
            }
        }
        fetchData();
    }, [searchText]);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: "",
            userName: "",
            phoneNumber: "",
        },
        validationSchema: validationSchema,
        validateOnChange: false,
        validateOnMount: true,
        onSubmit: async (values) => {
            const res = await fetch(
                `${process.env.REACT_APP_AUTH_API_URL}/Register`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        Email: values.email,
                        Password: values.password,
                        ConfirmPassword: values.confirmPassword,
                        FirstName: values.firstName,
                        LastName: values.lastName,
                        UserName: values.userName,
                        CityId: cityId,
                        PhoneNumber: values.phoneNumber,
                    }),
                }
            );
            if (res.ok) {
                navigate("/home");
            }
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
                            <TextInputLiveFeedback
                                required
                                label="Confirm Password"
                                id="confirmPassword"
                                inputName="Confirm Password"
                                variant="outlined"
                                name="confirmPassword"
                                onChange={formik.handleChange}
                                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                helpertext={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                type={showPassword ? 'text' : 'password'}
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
                            <TextInputLiveFeedback
                                required
                                id="firstName"
                                name="firstName"
                                label="First name"
                                onChange={formik.handleChange}
                                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                helpertext={formik.touched.firstName && formik.errors.firstName}
                                type="text"
                                variant="text"
                            />
                            <TextInputLiveFeedback
                                required
                                id="lastName"
                                name="lastName"
                                label="Last Name"
                                onChange={formik.handleChange}
                                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                helpertext={formik.touched.lastName && formik.errors.lastName}
                                type="text"
                                variant="text"
                            />
                            <TextInputLiveFeedback
                                required
                                id="userName"
                                name="userName"
                                label="User Name"
                                onChange={formik.handleChange}
                                error={formik.touched.userName && Boolean(formik.errors.userName)}
                                helpertext={formik.touched.userName && formik.errors.userName}
                                type="text"
                                variant="text"
                            />
                            <TextInputLiveFeedback
                                required
                                id="phoneNumber"
                                name="phoneNumber"
                                label="Phone Number"
                                onChange={formik.handleChange}
                                error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                                helpertext={formik.touched.phoneNumber && formik.errors.phoneNumber}
                                type="text"
                                variant="text"
                            />
                            <FormGroup className="form-group">
                                <FormControl fullWidth>
                                    <InputLabel id="city-select-label">City</InputLabel>
                                    <Select
                                        MenuProps={{autoFocus: false}}
                                        labelId="city-select-label"
                                        id="city-select"
                                        value={cityId}
                                        label="City"
                                        onChange={handleChange}
                                    >
                                        <ListSubheader>
                                            <TextField
                                                size="small"
                                                autoFocus
                                                placeholder="Type to search..."
                                                fullWidth
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <SearchIcon/>
                                                        </InputAdornment>
                                                    )
                                                }}
                                                onChange={(e) => setSearchText(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key !== "Escape") {
                                                        e.stopPropagation();
                                                    }
                                                }}
                                            />
                                        </ListSubheader>
                                        {
                                            displayCities.map((a) => (
                                                <MenuItem key={a.value} value={a.value}>
                                                    {a.text}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                                <span className="text-danger"></span>
                            </FormGroup>
                            <div className="buttonHolder">
                                <Button variant="primary" type="submit">
                                    Sign Up
                                </Button>
                            </div>
                        </Form>
                    </FormikProvider>
                </Col>
            </div>
        </>
    );
}

export default Register;