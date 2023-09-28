import "./FilterDialog.scss";
import React, {useState} from "react";
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    FormGroup,
    Grid, IconButton
} from "@mui/material";
import {Close} from "@mui/icons-material";

type Props = {
    open: boolean;
    onClose: () => void;
    handleApply: (filter: string) => void;
}

function FilterDialog(props: Props) {
    const [filtered, setFiltered] = useState<string[]>([]);

    const isChecked = (value: string) => {
        return filtered.indexOf(value) !== -1;
    }

    const onChangeTypeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
        const filter = [...filtered]
        if (event.target.checked) {
            filter.push(event.target.value);
        } else {
            const index = filtered.indexOf(event.target.value);
            if (index !== -1) {
                filter.splice(index, 1);
            }
        }
        setFiltered(filter);
    };

    const handleApply = () => {
        props.handleApply(filtered.toString())
    }

    const handleReset = () => {
        setFiltered([]);
        props.handleApply('');
    }

    return (
        <Dialog className="filter-emp-dialog" maxWidth="lg" open={props.open} onClose={props.onClose}>
            <IconButton className="close-btn" onClick={props.onClose}>
                <Close/>
            </IconButton>
            <DialogTitle>
                Filter Employee
            </DialogTitle>
            <DialogContent>
                <Grid container>
                    <Grid item xs={5}>
                        Employee Type
                    </Grid>
                    <Grid className="divider" item xs={1}>
                        <Divider orientation="vertical"/>
                    </Grid>
                    <Grid item xs={6}>
                        <FormGroup>
                            <FormControlLabel label="INTERNAL" control={
                                <Checkbox value="INTERNAL" checked={isChecked("INTERNAL")} onChange={onChangeTypeCheckbox}/>} />
                            <FormControlLabel label="EXTERNAL" control={
                                <Checkbox value="EXTERNAL" checked={isChecked("EXTERNAL")} onChange={onChangeTypeCheckbox}/>} />
                            <FormControlLabel label="FIXED-TERM" control={
                                <Checkbox value="FIXED_TERM" checked={isChecked("FIXED_TERM")} onChange={onChangeTypeCheckbox}/>} />
                        </FormGroup>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={handleApply}>
                    Apply
                </Button>
                <Button variant="outlined" color="primary" onClick={handleReset}>
                    Reset
                </Button>
                <Button variant="contained" color="inherit" onClick={props.onClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default FilterDialog;
