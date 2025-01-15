import React, { useEffect, useState } from "react";
import { Button, Form, FormGroup } from "reactstrap";
import { FormikProvider, useFormik } from "formik";
import * as yup from "yup";
import {
    FormControl,
    InputAdornment,
    InputLabel,
    ListSubheader,
    MenuItem,
    Select,
    TextField,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    CardActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import TextInputLiveFeedback from "../utils/TextInputLiveFeedback";

const validationSchema = yup.object({
    year: yup.number("Year must be a number").required("Year is required"),
    milleage: yup.number("Milleage must be a number").required("Milleage is required"),
    description: yup.string().required("Description is required"),
});

function AddOffer() {
    const [producerId, setProducer] = useState(0);
    const [producerText, setProducerText] = useState("");
    const [sizeId, setSize] = useState(0);
    const [sizeText, setSizeText] = useState("");
    const [colorId, setColor] = useState(0);
    const [colorText, setColorText] = useState("");
    const [typeId, setType] = useState(0);
    const [typeText, setTypeText] = useState("");

    const [displayProducers, setDisplayProducers] = useState([]);
    const [displaySizes, setDisplaySizes] = useState([]);
    const [displayColors, setDisplayColors] = useState([]);
    const [displayTypes, setDisplayTypes] = useState([]);

    useEffect(() => {
        async function fetchProducers() {
            if (producerText !== "") {
                const producersData = await fetch(
                    `https://localhost:44417/offers/producers?search=${producerText}`
                );
                const producers = await producersData.json();
                setDisplayProducers(
                    producers.map((item) => ({ value: item.value, text: item.text }))
                );
            }
        }
        fetchProducers();
    }, [producerText]);

    useEffect(() => {
        async function fetchSizes() {
            const sizesData = await fetch("https://localhost:44417/offers/sizes");
            const sizes = await sizesData.json();
            setDisplaySizes(sizes.map((item) => ({ value: item.value, text: item.text })));
        }
        fetchSizes();
    }, []);

    useEffect(() => {
        async function fetchColors() {
            if (colorText !== "") {
                const colorsData = await fetch(
                    `https://localhost:44417/offers/colors?search=${colorText}`
                );
                const colors = await colorsData.json();
                setDisplayColors(
                    colors.map((item) => ({ value: item.value, text: item.text }))
                );
            }
        }
        fetchColors();
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
    useEffect(() => {
        async function fetchTypes() {
            if (typeText !== "") {
                const typesData = await fetch(
                    `https://localhost:44417/offers/types?search=${typeText}`
                );
                const types = await typesData.json();
                setDisplayTypes(
                    types.map((item) => ({ value: item.value, text: item.text }))
                );
            }
        }
        fetchTypes();
    }, [typeText]);

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            year: "",
            milleage: "",
            description: "",
        },
        validationSchema,
        onSubmit: (values) => {
            navigate("/offer-points", {
                state: {
                    Year: values.year,
                    Milleage: values.milleage,
                    SizeId: sizeId,
                    ColorId: colorId,
                    Description: values.description,
                    TypeId: typeId,
                    ProducerId: producerId,
                },
            });
        },
    });

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Welcome to CarSharing!
            </Typography>
            <Card sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
                <CardContent>
                    <Typography variant="h5" align="center" gutterBottom>
                        Add Offer
                    </Typography>
                    <FormikProvider value={formik}>
                        <Form onSubmit={formik.handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextInputLiveFeedback
                                        label="Year"
                                        id="year"
                                        name="year"
                                        onChange={formik.handleChange}
                                        error={formik.touched.year && Boolean(formik.errors.year)}
                                        helpertext={formik.touched.year && formik.errors.year}
                                        type="text"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextInputLiveFeedback
                                        label="Milleage"
                                        id="milleage"
                                        name="milleage"
                                        onChange={formik.handleChange}
                                        error={formik.touched.milleage && Boolean(formik.errors.milleage)}
                                        helpertext={formik.touched.milleage && formik.errors.milleage}
                                        type="text"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextInputLiveFeedback
                                        label="Description"
                                        id="description"
                                        name="description"
                                        onChange={formik.handleChange}
                                        error={formik.touched.description && Boolean(formik.errors.description)}
                                        helpertext={formik.touched.description && formik.errors.description}
                                        type="text"
                                    />
                                </Grid>
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
                            </Grid>
                            <CardActions sx={{ justifyContent: "center" }}>
                                <Button variant="contained" color="primary" type="submit">
                                    Submit Offer
                                </Button>
                            </CardActions>
                        </Form>
                    </FormikProvider>
                </CardContent>
            </Card>
        </Box>
    );
}

export default AddOffer;