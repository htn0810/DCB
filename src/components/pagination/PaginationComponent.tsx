import "./PaginationComponent.scss";
import React, {useEffect, useState} from "react";
import {MenuItem, Pagination, TextField} from "@mui/material";

type Props = {
    count: number;
    page: number;
    rowsPerPageOptions: number[];
    rowsPerPage: number;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (size: number) => void;
}

function PaginationComponent(props: Props) {
    const [numOfPage, setNumOfPage] = useState(0);

    useEffect(() => {
        setNumOfPage(Math.floor(props.count / props.rowsPerPage) + (props.count % props.rowsPerPage === 0 ? 0 : 1));
    }, [props.count, props.rowsPerPage]);

    const onSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.onRowsPerPageChange(Number(event.target.value));
    }

    const onPageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        props.onPageChange(page - 1);
    }

    return (
        <div className="pagination-container">
            <TextField className="size-select" select size="small"
                       label="Rows per page"
                       value={props.rowsPerPage}
                       onChange={onSizeChange}>
                {props.rowsPerPageOptions.map(option =>
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                )}
            </TextField>
            <Pagination color="primary" count={numOfPage} page={props.page + 1} onChange={onPageChange}/>
        </div>
    )
}

export default PaginationComponent;
