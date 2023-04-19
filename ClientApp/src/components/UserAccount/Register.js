import React, {useEffect, useMemo, useState} from "react";
import {Button, Col, Form, FormGroup} from 'reactstrap';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SearchIcon from "@mui/icons-material/Search";
import {FormikProvider, useFormik} from 'formik';
import * as yup from 'yup';
import {FormControl, InputAdornment, InputLabel, ListSubheader, MenuItem, Select, TextField} from "@mui/material";
import {useNavigate} from "react-router-dom";
import debounce from 'lodash/debounce';
import TextInputLiveFeedback from "../utils/TextInputLiveFeedback";



const validationSchema = yup.object({
    email: yup
        .string()
        .email('Invalid email format.')
        .required('Email is required')
        .test('checkEmailUnique', 'This email is already registered',
            function (value) {
                return fetch('https://localhost:44417/useraccount/emailAvailability?email=' + value).then(async res => {
                    return await res.json();
                })
            }
        ),
    password: yup
        .string()
        .min(8, 'Password should be of minimum 8 characters length')
        .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*0-9]{10,}$/, "The Password must have at least one noumeric, one special character, one uppercase letter and have a length of at least 10.")
        .required('Password is required'),
    confirmPassword: yup
        .string()
        .when('password', (password, schema) => {
            return schema.test({
                test: confirmPassword => password[0] === confirmPassword,
                message: "The passwords must match"
            })
        }),
    firstName: yup
        .string()
        .matches(/^[a-zA-Z]*( [a-zA-Z]+)*$/, "Given names must have letters and be delimited by only one space.")
        .required(),
    lastName: yup
        .string()
        .matches(/^[a-zA-Z]*$/, "Last name must have only letters.")
        .required(),
    userName: yup
        .string()
        .min(5, "Username must be of at leat 5 characters")
        .matches(/^[a-zA-Z0-9]*$/, "The username must not contain special characters")
        .test('checkUserNameUnique', 'This username is already registered',
            function (value) {
                return fetch('https://localhost:44417/useraccount/userAvailability?userName=' + value).then(async res => {
                    return await res.json();
                })
            }
        )
        .required(),
    phoneNumber: yup
        .string()
        .matches(/^[0-9]+$/, "This is a phone number. Only digits!")
        .required()
});

function Register() {
    const [cityId, setCity] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [searchText, setSearchText] = useState("");
    const getCities = async (search) => {
        if (search != "") {
            let citiesData = await fetch('https://localhost:44417/useraccount/GetCities?search=' + search);
            return await citiesData.json();
        }
    }
    const [displayCities, setdisplayCities] = useState([])
    useEffect(() => {
        async function fetchData() {
            let cities = await getCities(searchText);
            if (cities != undefined) {
                cities = cities.map(result => ({
                    value: result.value,
                    text: result.text
                }));
                setdisplayCities(cities);
            }
        }

        fetchData();
    }, [searchText]);

    const handleClickShowPassword = () => setShowPassword((show) => !show);


    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleChange = (event) => {
        setCity(event.target.value);
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
            fetch('https://localhost:44417/useraccount/Register', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        Email: values.email,
                        Password: values.password,
                        ConfirmPassword: values.confirmPassword,
                        FirstName: values.firstName,
                        LastName: values.lastName,
                        UserName: values.userName,
                        CityId: cityId,
                        PhoneNumber: values.phoneNumber
                    }
                )
            }).then(async res => {
                res = await res.json();
                if(res)
                    navigate("/home")
            });
        },
    });
    const debouncedValidate = useMemo(
        () => debounce(formik.validateForm, 500),
        [formik.validateForm],
    );

    useEffect(
        () => {
            console.log('calling deboucedValidate');
            debouncedValidate(formik.values);
        },
        [formik.values, debouncedValidate],
    );
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