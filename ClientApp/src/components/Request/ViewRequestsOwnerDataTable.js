import React, {useEffect, useState} from "react";
import MaterialReactTable from "material-react-table";
import {Box, IconButton, Tooltip} from "@mui/material";
import {Delete, CheckCircle, ThumbDown} from "@mui/icons-material";

const columns = [
    {
        accessorKey: 'startDate',
        header: 'Start Time',
    },
    {
        accessorKey: 'endDate',
        header: 'End Time',
    }
    ,
    {
        accessorKey: 'borrowerName',
        header: 'Borrower',
    }
    ,
    {
        accessorKey: 'state',
        header: 'Status',
    }
];


const ViewRequestsOwnerDataTable = ({id}) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            let requests = await fetch('https://localhost:44417/requests/receivedRequests?id=' + id);
            setData(await requests.json())
        }
        fetchData();

    }, []);

    function handleAcceptOffer(row) {
        fetch('https://localhost:44417/requests/acceptRequest?id=' + row.original.requestId, {
            method: 'POST'
        }).then(async res => {
            res = await res.json();
            row.original.state = "Accepted"
        });
    }

    function handleDeclineOffer(row) {
        fetch('https://localhost:44417/requests/refuseRequest?id=' + row.original.requestId, {
            method: 'POST'
        }).then(async res => {
            res = await res.json();
            row.original.state = "Declined"
        });
    }

    return (
        <MaterialReactTable
            columns={columns}
            data={data}
            enableColumnActions={false}
            enableColumnFilters={false}
            enablePagination={false}
            enableSorting={false}
            enableBottomToolbar={false}
            enableTopToolbar={false}
            enableRowActions
            renderRowActions={({row, table}) => (
                <Box sx={{display: 'flex', flexWrap: 'nowrap', gap: '8px'}}>
                    {row.original.state === "Pending" ? (
                        <>
                            <Tooltip arrow placement="right" title="Accept Offer">
                                <IconButton onClick={() => handleAcceptOffer(row)}>
                                    <CheckCircle/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip arrow placement="right" title="Decline Offer">
                                <IconButton onClick={() => handleDeclineOffer(row)}>
                                    <ThumbDown/>
                                </IconButton>
                            </Tooltip>
                        </>) : (<div></div>)}
                </Box>
            )}
            muiTableBodyRowProps={{hover: false}}
        />
    );
}

export default ViewRequestsOwnerDataTable;