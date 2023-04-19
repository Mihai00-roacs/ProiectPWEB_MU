import React, {useEffect, useMemo, useState} from "react";
import {Button, Col, Form, FormGroup} from 'reactstrap';
import SearchIcon from "@mui/icons-material/Search";
import {FormikProvider, useFormik} from 'formik';
import * as yup from 'yup';
import {FormControl, InputAdornment, InputLabel, ListSubheader, MenuItem, Select, TextField} from "@mui/material";
import {useNavigate} from "react-router-dom";
import debounce from 'lodash/debounce';
import TextInputLiveFeedback from "../utils/TextInputLiveFeedback";

const validationSchema = yup.object({
    year: yup
        .number('Year must be a number')
        .required('Year is required'),
    milleage: yup
        .number('Milleage must be a number')
        .required('Milleage is required'),
    description: yup
        .string()
        .required('Description is required'),
});

function AddOffer() {
    const [producerId, setProducer] = React.useState(0);
    const [producerText, setProducerText] = useState("");
    const [sizeId, setSize] = React.useState(0);
    const [sizeText, setSizeText] = useState("");
    const [colorId, setColor] = React.useState(0);
    const [colorText, setColorText] = useState("");
    const [typeId, setType] = React.useState(0);
    const [typeText, setTypeText] = useState("");
    const getProducers = async (search) => {
        if (search !== "") {
            let producersData = await fetch('https://localhost:44417/offers/producers?search=' + search);
            return await producersData.json();
        }
    }
    const getSizes = async () => {
        let sizesData = await fetch('https://localhost:44417/offers/sizes');
        return await sizesData.json();
    }
    const getColors = async (search) => {
        if (search !== "") {
            let colorsData = await fetch('https://localhost:44417/offers/colors?search=' + search);
            return await colorsData.json();
        }
    }
    const getTypes = async (search) => {
        if (search !== "") {
            let typesData = await fetch('https://localhost:44417/offers/types?search=' + search);
            return await typesData.json();
        }
    }
    const [displayProducers, setdisplayProducers] = useState([])
    const [displaySizes, setdisplaySizes] = useState([])
    const [displayColors, setdisplayColors] = useState([])
    const [displayTypes, setdisplayTypes] = useState([])

    useEffect(() => {
        async function fetchData() {
            let producers = await getProducers(producerText);
            if (producers !== undefined) {
                producers = producers.map(result => ({
                    value: result.value,
                    text: result.text
                }));
                setdisplayProducers(producers);
            }
        }

        fetchData();
    }, [producerText]);

    useEffect(() => {
        async function fetchData() {
            let sizes = await getSizes();
            if (sizes !== undefined) {
                sizes = sizes.map(result => ({
                    value: result.value,
                    text: result.text
                }));
                setdisplaySizes(sizes);
            }
        }

        fetchData();
    }, []);
    useEffect(() => {
        async function fetchData() {
            let types = await getTypes(typeText);
            if (types !== undefined) {
                types = types.map(result => ({
                    value: result.value,
                    text: result.text
                }));
                setdisplayTypes(types);
            }
        }

        fetchData();
    }, [typeText]);
    useEffect(() => {
        async function fetchData() {
            let colors = await getColors(colorText);
            if (colors !== undefined) {
                colors = colors.map(result => ({
                    value: result.value,
                    text: result.text
                }));
                setdisplayColors(colors);
            }
        }

        fetchData();
    }, [colorText]);
    const handleProducerChange = (event) => {
        setProducer(event.target.value);
    };
    const handleColorChange = (event) => {
        setColor(event.target.value);
    };
    const handleSizeChange = (event) => {
        setSize(event.target.value);
    };
    const handleTypeChange = (event) => {
        setType(event.target.value);
    };
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            year: '',
            milleage: '',
            description: ''
        },
        validationSchema: validationSchema,
        validateOnChange: false,
        validateOnMount: true,
        onSubmit: (values) => {
            navigate("/offer-points", {
                state: {
                    Year: values.year,
                    Milleage: values.milleage,
                    SizeId: sizeId,
                    ColorId: colorId,
                    Description: values.description,
                    TypeId: typeId,
                    ProducerId: producerId
                }
            })
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
            <h5 style={{textAlign: 'center'}}>Add Offer</h5>
            <div className="row">
                <Col md={4}>
                    <FormikProvider value={formik}>
                        <Form onSubmit={formik.handleSubmit}>
                            <TextInputLiveFeedback
                                label="Year"
                                id="year"
                                name="year"
                                onChange={formik.handleChange}
                                error={formik.touched.year && Boolean(formik.errors.year)}
                                helpertext={formik.touched.year && formik.errors.year}
                                type="text"
                                variant="text"
                            />
                            <TextInputLiveFeedback
                                id="milleage"
                                name="milleage"
                                label="Milleage"
                                onChange={formik.handleChange}
                                error={formik.touched.milleage && Boolean(formik.errors.milleage)}
                                helpertext={formik.touched.milleage && formik.errors.milleage}
                                type="text"
                                variant="text"
                            />
                            <TextInputLiveFeedback
                                id="description"
                                name="description"
                                label="Description"
                                onChange={formik.handleChange}
                                error={formik.touched.description && Boolean(formik.errors.description)}
                                helpertext={formik.touched.description && formik.errors.description}
                                type="text"
                                variant="text"
                            />
                            <FormGroup className="form-group">
                                <FormControl fullWidth>
                                    <InputLabel id="producer-select-label">Producer</InputLabel>
                                    <Select
                                        MenuProps={{autoFocus: false}}
                                        labelId="producer-select-label"
                                        id="producer-select"
                                        value={producerId}
                                        label="City"
                                        onChange={handleProducerChange}
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
                                                onChange={(e) => setProducerText(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key !== "Escape") {
                                                        e.stopPropagation();
                                                    }
                                                }}
                                            />
                                        </ListSubheader>
                                        {
                                            displayProducers.map((a) => (
                                                <MenuItem key={a.value} value={a.value}>
                                                    {a.text}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                                <span className="text-danger"></span>
                            </FormGroup>
                            <FormGroup className="form-group">
                                <FormControl fullWidth>
                                    <InputLabel id="color-select-label">Color</InputLabel>
                                    <Select
                                        MenuProps={{autoFocus: false}}
                                        labelId="color-select-label"
                                        id="color-select"
                                        value={colorId}
                                        label="Color"
                                        onChange={handleColorChange}
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
                                                onChange={(e) => setColorText(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key !== "Escape") {
                                                        e.stopPropagation();
                                                    }
                                                }}
                                            />
                                        </ListSubheader>
                                        {
                                            displayColors.map((a) => (
                                                <MenuItem key={a.value} value={a.value}>
                                                    {a.text}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                                <span className="text-danger"></span>
                            </FormGroup>
                            <FormGroup className="form-group">
                                <FormControl fullWidth>
                                    <InputLabel id="type-select-label">Type</InputLabel>
                                    <Select
                                        MenuProps={{autoFocus: false}}
                                        labelId="type-select-label"
                                        id="type-select"
                                        value={typeId}
                                        label="Type"
                                        onChange={handleTypeChange}
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
                                                onChange={(e) => setTypeText(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key !== "Escape") {
                                                        e.stopPropagation();
                                                    }
                                                }}
                                            />
                                        </ListSubheader>
                                        {
                                            displayTypes.map((a) => (
                                                <MenuItem key={a.value} value={a.value}>
                                                    {a.text}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                                <span className="text-danger"></span>
                            </FormGroup>
                            <FormGroup className="form-group">
                                <FormControl fullWidth>
                                    <InputLabel id="size-select-label">Size</InputLabel>
                                    <Select
                                        MenuProps={{autoFocus: false}}
                                        labelId="size-select-label"
                                        id="size-select"
                                        value={sizeId}
                                        label="Size"
                                        onChange={handleSizeChange}
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
                                                onChange={(e) => setSizeText(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key !== "Escape") {
                                                        e.stopPropagation();
                                                    }
                                                }}
                                            />
                                        </ListSubheader>
                                        {
                                            displaySizes.map((a) => (
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

export default AddOffer;