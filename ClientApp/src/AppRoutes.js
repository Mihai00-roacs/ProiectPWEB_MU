import  Home  from "./components/Home/Home";
import  Login from "./components//UserAccount/Login";
import Register  from "./components/UserAccount/Register";
import LoginWith2Factor from "./components//UserAccount/LoginWith2Factor";
import OfferDetails from "./components/Offer/OfferDetails";
import AddOffer from "./components/Offer/AddOffer";
import Offers from "./components/Offer/Offers";
import AddOfferIntervals from "./components/Offer/AddOfferIntervals";
import AddOfferPoints from "./components/Offer/AddOfferPoints";
import SendRequest from "./components/Request/SendRequest";
import ViewRequests from "./components/Request/ViewRequests";
import ViewRequestsOwner from "./components/Request/ViewRequestsOwner";
import SelfOffers from "./components/Offer/SelfOffers";
import BorrowedCars from "./components/Offer/BorrowedCars";
const AppRoutes = [
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/home',
        element: <Home />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/login2factor',
        element: <LoginWith2Factor />
    },
    {
        path: '/home',
        element: <Home />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/offers',
        element: <Offers />
    },
    {
        path: '/self-offers',
        element: <SelfOffers />
    },
    {
        path: '/borrowed-cars',
        element: <BorrowedCars />
    },
    {
        path: '/add-offer',
        element: <AddOffer />
    },
    {
        path: '/offer-intervals',
        element: <AddOfferIntervals />
    },
    {
        path: '/send-request/:id',
        element: <SendRequest />
    },
    {
        path: '/sent-requests/:id',
        element: <ViewRequests />
    },
    {
        path: '/offer-points',
        element: <AddOfferPoints />
    },
    {
        path: '/offer-details/:id',
        element: <OfferDetails/>
    },
    {
        path: '/requests-owner/:id',
        element: <ViewRequestsOwner />
    },
];

export default AppRoutes;
