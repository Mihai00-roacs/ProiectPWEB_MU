import React, {useEffect, useRef, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import mapboxgl from "mapbox-gl";
import {Button} from "reactstrap";
import {useAuth} from "../Authentication/Auth";

function AddOfferPoints() {
    const {state} = useLocation();
    const {userId} = useAuth();
    const {Year, Milleage, SizeId,ColorId,Description,TypeId,ProducerId} = state;
    const map = useRef(null);
    const mapContainer = useRef(null);
    const [lng, setLng] = useState(26.1275);
    const [lat, setLat] = useState(44.4398);
    const [zoom, setZoom] = useState(11);
    const [button, setButton] = useState(null);
    const navigate = useNavigate();
    const [markerLng, setMarkerLng] = useState(0);
    const [marketLat,setMarkerLat] = useState(0);
    let marker = null;
    function add_marker(e) {
        setMarkerLng(e.lngLat.lng);
        setMarkerLat(e.lngLat.lat);
        if (marker != null) {
            marker.setLngLat(e.lngLat);
            return;
        }
        //add marker
        marker = new mapboxgl.Marker()
            .setLngLat(e.lngLat)
            .addTo(map.current)
    }

    useEffect(() => {
        if (map.current) {
            return;
        }
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

        map.current.on('click', add_marker)

    }, []);
    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });
    });

    function handleSubmit() {
        if(marketLat!= 0 || markerLng != 0) {
            fetch('https://localhost:44417/offers/addpoints', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        XCoordinate: markerLng,
                        YCoordinate: marketLat,
                        Year: Year,
                        Milleage: Milleage,
                        SizeId: SizeId,
                        ColorId: ColorId,
                        Description: Description,
                        TypeId: TypeId,
                        ProducerId: ProducerId,
                        OwnerId: userId
                    }
                )
            }).then(async res => {
                res = await res.json();
                if (res)
                    navigate("/offer-intervals", {
                        state: {
                            OfferId: res
                        }
                    })
            });
        }
    }

    return (
        <div>
            <div>
                <div className="sidebar">
                    Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
                </div>
                <div ref={mapContainer} className="map-container"/>
            </div>
            <div className="buttonHolder" style={{marginLeft : 0}}>
                <Button variant="primary" onClick={handleSubmit}>
                    Add Point
                </Button>
            </div>
        </div>
    )
}

export default AddOfferPoints;