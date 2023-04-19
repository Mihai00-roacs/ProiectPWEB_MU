import {useParams} from "react-router-dom";
import SentRequestsDataTable from "./SentRequestsDataTable";
import React from "react";
import ViewRequestsOwnerDataTable from "./ViewRequestsOwnerDataTable";

function ViewRequestsOwner(){
    let {id} = useParams();
    return (
        <>
            <ViewRequestsOwnerDataTable id={id}></ViewRequestsOwnerDataTable>
        </>
    )
}
export default ViewRequestsOwner;