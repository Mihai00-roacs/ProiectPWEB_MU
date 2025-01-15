// src/pages/OfferDetails.jsx
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Grid,
    Paper,
    Typography,
} from "@mui/material";
import { useAuth } from "../Authentication/Auth";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PersonIcon from "@mui/icons-material/Person";

function OfferDetails() {
    let { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, userName } = useAuth();
    const [offer, setOffer] = useState(null);

    useEffect(() => {
        async function fetchImage() {
            try {
                const res = await fetch(
                    `https://localhost:44417/offers/getOfferById?offerId=${id}`
                );
                const offerModel = await res.json();
                setOffer(offerModel);
            } catch (error) {
                console.error("Failed to fetch offer:", error);
            }
        }

        fetchImage();
    }, [id]);

    if (!offer) {
        return <Typography align="center">Loading...</Typography>;
    }

    return (
        <Box
            sx={{
                p: 3,
                background: "linear-gradient(to right, #4e54c8, #8f94fb)",
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Card
                sx={{
                    width: "60%",
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
                    <LocalOfferIcon sx={{ fontSize: 40, mr: 1 }} />
                    Offer Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                    {[
                        { label: "Producer", value: offer.producerName },
                        { label: "Color", value: offer.colorName },
                        { label: "Size", value: offer.sizeName },
                        { label: "Type", value: offer.typeName },
                        { label: "Year", value: offer.year },
                        { label: "Mileage", value: offer.milleage },
                        { label: "Description", value: offer.description },
                        { label: "Owner", value: offer.ownerName },
                    ].map((item, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                            <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                                sx={{ color: "#333" }}
                            >
                                {item.label}
                            </Typography>
                            <Typography variant="body2">{item.value}</Typography>
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ mt: 4 }}>
                    {offer.ownerName === userName ? (
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ backgroundColor: "#4e54c8", "&:hover": { backgroundColor: "#373ccd" } }}
                                    onClick={() => navigate(`/edit-offer/${id}`)}
                                >
                                    Edit Offer
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ backgroundColor: "#4e54c8", "&:hover": { backgroundColor: "#373ccd" } }}
                                    onClick={() => navigate(`/requests-owner/${id}`)}
                                >
                                    View Received Requests
                                </Button>
                            </Grid>
                        </Grid>
                    ) : (
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ backgroundColor: "#4e54c8", "&:hover": { backgroundColor: "#373ccd" } }}
                                    onClick={() => navigate(`/send-request/${id}`)}
                                >
                                    Send Request
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ backgroundColor: "#4e54c8", "&:hover": { backgroundColor: "#373ccd" } }}
                                    onClick={() => navigate(`/sent-requests/${id}`)}
                                >
                                    View Sent Requests
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    fullWidth
                                    sx={{ backgroundColor: "#d32f2f", "&:hover": { backgroundColor: "#9a0007" } }}
                                    onClick={async () =>
                                        await fetch("https://localhost:44417/requests/unsendRequests")
                                    }
                                >
                                    Unsend All Unaccepted Requests
                                </Button>
                            </Grid>
                        </Grid>
                    )}
                </Box>
            </Card>
        </Box>
    );
}

export default OfferDetails;
