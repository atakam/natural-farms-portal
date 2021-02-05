import React, {useState} from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
    Divider,
  TextField,
  Typography
} from '@material-ui/core';

const PaymentSelection = ({ className, productDetails, paymentDetails, setPaymentDetails, isEditAllowed, ...rest }) => {
    const [details, setDetails] = useState(paymentDetails);

    let pts = Object.values(productDetails);
    pts = pts.reduce((r, a) => {
        r[a.points] = [...r[a.points] || [], a];
        return r;
    }, {});
    pts = Object.keys(pts);
    const total_points = (pts.reduce((a, b) => Number(a) + Number(b), 0));

    const getDateString = (d) => {
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = d.getFullYear();

        return yyyy + '-' + mm +'-' + dd;
    }

    const editedPrice = details.edited_price > -1 ? details.edited_price : details.price;
    const editedRebate = details.edited_rebate > -1 ? details.edited_rebate : details.rebate;
    const editedDeposit = details.edited_deposit > -1 ? details.edited_deposit : details.deposit;
    const balance = !isEditAllowed ? details.price - details.rebate - details.deposit
        : editedPrice - editedRebate - editedDeposit;

    return (
        <PerfectScrollbar>
            <Box minWidth={1050}>
                <Typography
                    color="textSecondary"
                    variant="h4"
                    style={{
                        paddingRight: '30px'
                    }}
                >
                    {'Order Details'}
                </Typography>
                <TextField
                    error={isEditAllowed && (total_points !== details.total_points)}
                    helperText={isEditAllowed && ((total_points > details.total_points ? 'Points greater than original' : (total_points < details.total_points ? 'Points less than original' : '')) + ' (' + details.total_points + ')')}
                    label="Total Points"
                    margin="normal"
                    name="name"
                    value={isEditAllowed ? total_points || 0 : (details.edited_points > -1 ? details.edited_points : details.total_points || 0)}
                    variant="outlined"
                    style={{width: '33%', paddingRight: '10px'}}
                    disabled
                />
                <TextField
                    label="Price ($)"
                    margin="normal"
                    name="name"
                    variant="outlined"
                    style={{width: '33%', paddingRight: '10px'}}
                    onChange={(e) => {
                        const value = Number(e.currentTarget.value);
                        let newDetails = {
                            ...details,
                            price: value
                        };
                        if (isEditAllowed) newDetails = {
                            ...details,
                            edited_price: value
                        };
                        setDetails(newDetails);
                        setPaymentDetails(newDetails);
                    }}
                    value={!isEditAllowed ? (details.price || 0) : (details.edited_price > -1 ? details.edited_price : (details.price || 0))}
                />
                <TextField
                    label="Rebate ($)"
                    margin="normal"
                    name="name"
                    variant="outlined"
                    style={{width: '33%', paddingRight: '10px'}}
                    onChange={(e) => {
                        const value = Number(e.currentTarget.value);
                        let newDetails = {
                            ...details,
                            rebate: value
                        };
                        if (isEditAllowed) newDetails = {
                            ...details,
                            edited_rebate: value
                        };
                        setDetails(newDetails);
                        setPaymentDetails(newDetails);
                    }}
                    value={!isEditAllowed ? (details.rebate || 0) : (details.edited_rebate > -1 ? details.edited_rebate : (details.rebate || 0))}
                />
                <TextField
                    label="Deposit ($)"
                    margin="normal"
                    name="name"
                    variant="outlined"
                    style={{width: '33%', paddingRight: '10px'}}
                    onChange={(e) => {
                        const value = Number(e.currentTarget.value);
                        let newDetails = {
                            ...details,
                            deposit: value
                        };
                        if (isEditAllowed) newDetails = {
                            ...details,
                            edited_deposit: value
                        };
                        setDetails(newDetails);
                        setPaymentDetails(newDetails);
                    }}
                    value={!isEditAllowed ? (details.deposit || 0) : (details.edited_deposit > -1 ? details.edited_deposit : (details.deposit || 0))}
                />
                <TextField
                    label="Balance ($)"
                    margin="normal"
                    name="name"
                    value={balance}
                    variant="outlined"
                    style={{width: '33%', paddingRight: '10px'}}
                    disabled
                />
                <Divider style={{margin: '20px 0'}} />
                <Typography
                        color="textSecondary"
                        variant="h4"
                        style={{
                            paddingRight: '30px'
                        }}
                    >
                        {'Payment Details'}
                </Typography>
                <TextField
                    label="Payment Type"
                    margin="normal"
                    name="name"
                    onChange={(e) => {
                        const newDetails = {
                            ...details,
                            cc_flag: e.currentTarget.value === 'cc' ? 1 : 0,
                            preauthorized_flag: e.currentTarget.value === 'pa' ? 1 : 0,
                            cash_flag: e.currentTarget.value === 'cash' ? 1 : 0
                        };
                        setDetails(newDetails);
                        setPaymentDetails(newDetails);
                    }}
                    value={details.cc_flag === 1 ? 'cc' : (details.cash_flag === 1 ? 'cash' : 'pa')}
                    variant="outlined"
                    type="select"
                    style={{width: '33%', paddingRight: '10px'}}
                />
                <TextField
                    label="How many instalments?"
                    margin="normal"
                    name="name"
                    onChange={(e) => {
                        const number = Number(e.currentTarget.value);
                        const newDetails = {
                            ...details,
                            conditions_numwithdrawals: number
                        };
                        setDetails(newDetails);
                        setPaymentDetails(newDetails);
                    }}
                    value={details.conditions_numwithdrawals || 0}
                    variant="outlined"
                    type="number"
                    style={{width: '33%', paddingRight: '10px'}}
                />
                <TextField
                    label="Withdrawal Amount"
                    margin="normal"
                    name="name"
                    onChange={(e) => {
                        const number = Number(e.currentTarget.value);
                        const newDetails = {
                            ...details,
                            conditions_withdrawalamount: number
                        };
                        setDetails(newDetails);
                        setPaymentDetails(newDetails);
                    }}
                    value={details.conditions_withdrawalamount || 0}
                    variant="outlined"
                    type="number"
                    style={{width: '33%', paddingRight: '10px'}}
                />

                <TextField
                    label="First Withdrawal Date"
                    margin="normal"
                    name="name"
                    onChange={(e) => {
                        const date = new Date(e.currentTarget.value + ' 6:00 pm');
                        const newDetails = {
                            ...details,
                            conditions_firstwithdrawaldate: getDateString(date)
                        };
                        setDetails(newDetails);
                        setPaymentDetails(newDetails);
                    }}
                    value={details.conditions_firstwithdrawaldate || new Date()}
                    variant="outlined"
                    type="date"
                    style={{width: '33%', paddingRight: '10px'}}
                />

                <TextField
                    label="Contract Validity (in months)"
                    margin="normal"
                    name="name"
                    onChange={(e) => {
                        const number = Number(e.currentTarget.value);
                        const newDetails = {
                            ...details,
                            conditions_nummonths: number
                        };
                        setDetails(newDetails);
                        setPaymentDetails(newDetails);
                    }}
                    value={details.conditions_nummonths || 0}
                    variant="outlined"
                    type="number"
                    style={{width: '33%', paddingRight: '10px'}}
                />

                <TextField
                    label="Contract Start Date"
                    margin="normal"
                    name="name"
                    onChange={(e) => {
                        const date = new Date(e.currentTarget.value + ' 6:00 pm');
                        const newDetails = {
                            ...details,
                            conditions_startcontractdate: getDateString(date)
                        };
                        setDetails(newDetails);
                        setPaymentDetails(newDetails);
                    }}
                    value={details.conditions_startcontractdate || new Date()}
                    variant="outlined"
                    type="date"
                    style={{width: '33%'}}
                />
            </Box>
        </PerfectScrollbar>
  );
};

PaymentSelection.propTypes = {
  className: PropTypes.string
};

export default PaymentSelection;
