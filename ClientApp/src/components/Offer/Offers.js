import React, {useEffect, useRef, useState} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import "mapbox-gl/dist/mapbox-gl.css";
import OffersDataTable from "./OffersDataTable";
import mapboxgl from 'mapbox-gl';
import {useNavigate} from "react-router-dom";

mapboxgl.accessToken = 'pk.eyJ1IjoibWloYWkwMjAwIiwiYSI6ImNsZzhjOTd2YjB3OTEzZ3A4bjl3bnA5bmsifQ.gq21MjyBrYrq8Skwya6HOA';

function Offers() {
    const queryClient = new QueryClient();
    const mapContainer = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const map = useRef(null);
    const [lng, setLng] = useState(26.1275);
    const [lat, setLat] = useState(44.4398);
    const [zoom, setZoom] = useState(11);
    const [offers, setOffers] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        if (map.current) {
            // eslint-disable-next-line array-callback-return
            offers.map(offer => {
                if(offer.yCoordinate > -90 && offer.yCoordinate < 90) {
                    const marker = new mapboxgl.Marker()
                        .setLngLat([offer.xCoordinate, offer.yCoordinate])
                        .addTo(map.current);
                    marker.getElement().addEventListener('click', () => {
                        navigate('/offer-details/' + offer.offerId)
                    });
                }
            })
            return;
        }
         // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: zoom
        });
        map.current.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                trackUserLocation: true,
                showUserHeading: true
            })
        );

    }, [offers]);
    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });
    });

    return (
        <div>
            <QueryClientProvider client={queryClient}>
                <OffersDataTable setOffers={setOffers} offersLink={"GetOffers"}/>
            </QueryClientProvider>

            <div>
                <div className="sidebar">
                    Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
                </div>
                <div ref={mapContainer} className="map-container"/>
            </div>
        </div>
    );
}

export default Offers;