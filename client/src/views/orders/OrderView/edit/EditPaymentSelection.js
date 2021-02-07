import React, {useState} from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Divider,
  MenuItem,
  TextField,
  Typography
} from '@material-ui/core';

const PaymentSelection = ({ className, productDetails, paymentDetails, setPaymentDetails, ...rest }) => {
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

    let paymentTypes = [
        {
            label: 'Cash',
            value: 'cash'
        },
        {
            label: 'Credit Card',
            value: 'cc'
        },
        {
            label: 'Pre-authorized Payment',
            value: 'pa'
        }
    ];
    paymentTypes = 
        paymentTypes.map((option) => (
            <MenuItem key={option.value} value={option.value}>
             {option.label}
            </MenuItem>
        ));

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
                    label="Total Points"
                    margin="normal"
                    name="name"
                    value={details.total_points || total_points || 0}
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
                        const newDetails = {
                            ...details,
                            price: value,
                            total: value - details.rebate - details.deposit
                        };
                        setDetails(newDetails);
                        setPaymentDetails(newDetails);
                    }}
                    value={details.price || 0}
                />
                <TextField
                    label="Rebate ($)"
                    margin="normal"
                    name="name"
                    variant="outlined"
                    style={{width: '33%', paddingRight: '10px'}}
                    onChange={(e) => {
                        const value = Number(e.currentTarget.value);
                        const newDetails = {
                            ...details,
                            rebate: value,
                            total: details.price - details.deposit - value
                        };
                        setDetails(newDetails);
                        setPaymentDetails(newDetails);
                    }}
                    value={details.rebate || 0}
                />
                <TextField
                    label="Deposit ($)"
                    margin="normal"
                    name="name"
                    variant="outlined"
                    style={{width: '33%', paddingRight: '10px'}}
                    onChange={(e) => {
                        const value = Number(e.currentTarget.value);
                        const newDetails = {
                            ...details,
                            deposit: value,
                            total: details.price - details.rebate - value
                        };
                        setDetails(newDetails);
                        setPaymentDetails(newDetails);
                    }}
                    value={details.deposit || 0}
                />
                <TextField
                    label="Balance ($)"
                    margin="normal"
                    name="name"
                    value={details.total || 0}
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
                >
                    {paymentTypes}
                </TextField>
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
