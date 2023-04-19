import React from "react";
import SentRequestsDataTable from "./SentRequestsDataTable";
import {useParams} from "react-router-dom";

function ViewRequests(){
    let {id} = useParams();
    return (
        <>
           <SentRequestsDataTable id={id}></SentRequestsDataTable>
        </>
    )
}
export default ViewRequests;