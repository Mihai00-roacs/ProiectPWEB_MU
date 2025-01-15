import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useInfiniteQuery} from "@tanstack/react-query";
import MaterialReactTable from "material-react-table";
import {Info} from "@mui/icons-material";
import {
    Box,
    IconButton,
    Typography,
    Tooltip,
} from '@mui/material';
import {Delete, Edit} from '@mui/icons-material';
import {useAuth} from "../Authentication/Auth";

const columns = [
    {
        accessorKey: 'producerName',
        header: 'Producer',
    },
    {
        accessorKey: 'colorName',
        header: 'Color',
    },
    {
        accessorKey: 'sizeName',
        header: 'Size',
    },
    {
        accessorKey: 'typeName',
        header: 'Type',
    },
    {
        accessorKey: 'year',
        header: 'Year',
    },
];

const fetchSize = 25;

function OffersDataTable({setOffers,offersLink}) {
    const tableContainerRef = useRef(null); //we can get access to the underlying TableContainer element and react to its scroll events
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState();
    const [sorting, setSorting] = useState([]);
    const {userId} = useAuth();
    const navigate = useNavigate();
    const {data, fetchNextPage, isError, isFetching, isLoading} =
        useInfiniteQuery({
            queryKey: ['table-data', columnFilters, globalFilter, sorting],
            queryFn: async ({pageParam = 0}) => {
                const url = new URL(
                    "https://localhost:44417/offers/"+offersLink
                );
                url.searchParams.set('userId', `${userId}`);
                const response = await fetch(url.href);
                const response_json = await response.json();
                setOffers(current => [...current, ...response_json])
                return response_json;
            },
            getNextPageParam: (_lastGroup, groups) => groups.length,
            keepPreviousData: true,
            refetchOnWindowFocus: false,
        });

    const flatData = useMemo(
        () => data?.pages.flatMap((page) => page) ?? [],
        [data],
    );
    const [rowCount, setRowCount] = useState(0);
    const getRowsCount = async () => {
        const response = await fetch(
            "https://localhost:44417/offers/"+offersLink+"Length"
        ).then((response) => response.json());

        // update the state
        setRowCount(response);
    };
    useEffect(() => {
        getRowsCount();
    }, []);
    const totalFetched = flatData.length;

    //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
    const fetchMoreOnBottomReached = useCallback(
        (containerRefElement) => {
            if (containerRefElement) {
                const {scrollHeight, scrollTop, clientHeight} = containerRefElement;
                //once the user has scrolled within 400px of the bottom of the table, fetch more data if we can
                if (
                    scrollHeight - scrollTop - clientHeight < 100 &&
                    !isFetching &&
                    totalFetched < rowCount
                ) {
                    fetchNextPage();
                }
            }
        },
        [fetchNextPage, isFetching, totalFetched, rowCount],
    );

    //a check on mount to see if the table is already scrolled to the bottom and immediately needs to fetch more data
    useEffect(() => {
        fetchMoreOnBottomReached(tableContainerRef.current);
    }, [fetchMoreOnBottomReached]);

    function handleEditRow(row) {
    }

    function handleDeleteRow(row) {

    }

    return (
        <MaterialReactTable
            columns={columns}
            data={flatData}
            enablePagination={false}
            manualFiltering
            enableRowActions
            renderRowActions={({row, table}) => (
                <Box sx={{display: 'flex', flexWrap: 'nowrap', gap: '8px'}}>
                    <IconButton
                        color="primary"
                        onClick={() =>
                            navigate('/offer-details/' + row.original.offerId)
                        }
                    >
                        <Info/>
                    </IconButton>
                    <Tooltip arrow placement="left" title="Edit">
                        <IconButton onClick={() => handleEditRow(row)}>
                            <Edit/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip arrow placement="right" title="Delete">
                        <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                            <Delete/>
                        </IconButton>
                    </Tooltip>
                </Box>
            )}
            manualSorting
            muiTableContainerProps={{
                ref: tableContainerRef, //get access to the table container element
                sx: {maxHeight: '600px'}, //give the table a max height
                onScroll: (
                    event, //add an event listener to the table container element
                ) => fetchMoreOnBottomReached(event.target),
            }}
            muiToolbarAlertBannerProps={
                isError
                    ? {
                        color: 'error',
                        children: 'Error loading data',
                    }
                    : undefined
            }
            onColumnFiltersChange={setColumnFilters}
            onGlobalFilterChange={setGlobalFilter}
            onSortingChange={setSorting}
            renderBottomToolbarCustomActions={() => (
                <Typography>
                    Fetched {totalFetched} of {rowCount} total rows.
                </Typography>
            )}
            state={{
                columnFilters,
                isLoading,
                showAlertBanner: isError,
                showProgressBars: isFetching,
                sorting,
            }}
        />
    );
}

export default OffersDataTable;