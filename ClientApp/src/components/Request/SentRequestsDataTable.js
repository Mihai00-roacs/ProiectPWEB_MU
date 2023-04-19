import React, {useEffect, useState} from "react";
import MaterialReactTable from "material-react-table";
import {Box, IconButton, Tooltip} from "@mui/material";
import {Delete} from "@mui/icons-material";

const columns = [
    {
        accessorKey: 'startDate',
        header: 'Start Time',
    },
    {
        accessorKey: 'endDate',
        header: 'End Time',
    },
    {
        accessorKey: 'state',
        header: 'Status',
    }
];


function SentRequestsDataTable(id) {
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            let sentRequests = await fetch('https://localhost:44417/requests/sentRequests?id=' + id.id);
            setData(await sentRequests.json())
            return await sentRequests.json();
        }
        fetchData();

    }, []);


    function handleDeleteRow(row) {
        fetch('https://localhost:44417/requests/deleteRequest?id=' + row.original.requestId).then(async res => {
            res = await res.json();
            if (res) {
                data.splice(row.index, 1);
                setData([...data]);
            }
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
            muiTableBodyRowProps={{hover: false}}
            renderRowActions={({row, table}) => (
                <Box sx={{display: 'flex', flexWrap: 'nowrap', gap: '8px'}}>
                    {row.original.state !== "Accepted" ? (<Tooltip arrow placement="right" title="Unsend Offer">
                        <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                            <Delete/>
                        </IconButton>
                    </Tooltip>) : (<div></div>)}
                </Box>
            )}
        />
    );
}

export default SentRequestsDataTable;