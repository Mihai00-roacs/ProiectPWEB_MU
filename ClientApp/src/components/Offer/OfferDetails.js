import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Divider, Grid, Paper, Typography} from "@mui/material";
import {currentUser} from "../Shared/Layout";
import {Button} from "reactstrap";
import {useAuth} from "../Authentication/Auth";

function OfferDetails() {
    let {id} = useParams();
    const navigate = useNavigate();
    const {isAuthenticated, userName} = useAuth();
    const [offer, setOffer] = useState(null);
    useEffect(() => {
        async function fetchImage() {
            const res = await fetch('https://localhost:44417/offers/getOfferById?offerId=' + id);
            const offerModel = await res.json();
            setOffer(offerModel);
        }

        fetchImage();
    }, []);
    return (
        <>
            {offer ? (
                <div>
                    <Typography align="center" variant="h4" gutterBottom>
                        Offer Details
                    </Typography>
                    <Divider/>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Paper>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle1">Producer</Typography>
                                        <Typography variant="body1">{offer.producerName}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle1">Color</Typography>
                                        <Typography variant="body1">{offer.colorName}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle1">Size</Typography>
                                        <Typography variant="body1">{offer.sizeName}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle1">Type</Typography>
                                        <Typography variant="body1">{offer.typeName}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle1">Year</Typography>
                                        <Typography variant="body1">{offer.year}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle1">Mileage</Typography>
                                        <Typography variant="body1">{offer.milleage}</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1">Description</Typography>
                                        <Typography variant="body1">{offer.description}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle1">Owner</Typography>
                                        <Typography variant="body1">{offer.ownerName}</Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                    {offer.ownerName === userName ? (
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Button variant="contained" color="primary" fullWidth>
                                    Edit offer
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Button variant="contained" color="primary"  onClick={() => navigate("/requests-owner/" + id)} fullWidth>
                                    View Received Requests
                                </Button>
                            </Grid>
                         {/*   <Grid item xs={12} sm={4}>
                                <Button variant="contained" color="secondary" fullWidth>
                                    Delete Offer
                                </Button>
                            </Grid>*/}
                        </Grid>
                    ) : (
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Button variant="contained" color="primary"
                                        onClick={() => navigate("/send-request/" + id)}>
                                    Send request
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Button variant="contained" color="primary"
                                        onClick={() => navigate("/sent-requests/" + id)}>
                                    View Sent Requests
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Button variant="contained" color="secondary"
                                        onClick={async () => await fetch('https://localhost:44417/requests/unsendRequests')}>
                                    Unsend all unaccepted requests
                                </Button>
                            </Grid>
                        </Grid>)
                    }
                </div>) : (<div></div>)}
        </>
    );
}

export default OfferDetails;