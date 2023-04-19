import React, { useEffect, useState} from "react";
import MaterialReactTable from "material-react-table";

const columns = [
    {
        accessorKey: 'startDate',
        header: 'Start Time',
    },
    {
        accessorKey: 'endDate',
        header: 'End Time',
    }
];


function AvailableIntervalsDataTable({id, setAvailableIntervals}) {
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            let availableIntervalsData = await fetch('https://localhost:44417/requests/availableIntervals?id='+id);
            setData(await availableIntervalsData.json())
            }
        fetchData();

    }, [
    ]);
    useEffect(() => {
        setAvailableIntervals(data)

    }, [data
    ]);

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
            muiTableBodyRowProps={{ hover: false }}
        />
    );
}

export default AvailableIntervalsDataTable;