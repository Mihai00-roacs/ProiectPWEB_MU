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


const UnAvailableIntervalsDataTable = ({id,setUnavailableIntervals}) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            let unAvailableIntervalsData = await fetch('https://localhost:44417/requests/unavailableIntervals?id='+id);
            setData(await unAvailableIntervalsData.json())
            setUnavailableIntervals(data)
        }
        fetchData();

    }, [
    ]);
    useEffect(() => {
        setUnavailableIntervals(data)

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

export default UnAvailableIntervalsDataTable;