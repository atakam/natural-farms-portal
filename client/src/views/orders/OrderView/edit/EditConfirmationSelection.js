import React, {useState} from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Divider,
  TextField,
  Typography
} from '@material-ui/core';

const TermsSelection = ({ className, deliveryDetails, paymentDetails, customerDetails, productDetails, confirmationDetails, setConfirmationDetails, results, userRole, isEdit, ...rest }) => {
    const [details, setDetails] = useState(confirmationDetails);

    // let pts = Object.values(productDetails);
    // pts = pts.reduce((r, a) => {
    //     r[a.points] = [...r[a.points] || [], a];
    //     return r;
    // }, {});
    // pts = Object.keys(pts);
    // const total_points = (pts.reduce((a, b) => Number(a) + Number(b), 0));

    const getDateString = (d) => {
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = d.getFullYear();

        return yyyy + '-' + mm +'-' + dd;
    }

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
                    {'Customer Confirmation'}
                </Typography>
                <Typography
                    color="textSecondary"
                    variant="h6"
                    style={{
                        paddingRight: '30px'
                    }}
                >
                    {'By typing you full name, you agree to the terms of tis contract'}
                </Typography>
                <TextField
                    label="CUSTOMER FULL NAME"
                    margin="normal"
                    name="name"
                    variant="outlined"
                    style={{width: '33%', paddingRight: '10px'}}
                    onChange={(e) => {
                        const newDetails = {
                            ...details,
                            signature_consumer_name: e.currentTarget.value,
                        };
                        setDetails(newDetails);
                        setConfirmationDetails(newDetails);
                    }}
                    value={details.signature_consumer_name}
                />
                <TextField
                    label="City, Province"
                    margin="normal"
                    name="name"
                    variant="outlined"
                    style={{width: '33%', paddingRight: '10px'}}
                    value={details.signature_address}
                    onChange={(e) => {
                        const newDetails = {
                            ...details,
                            signature_address: e.currentTarget.value,
                        };
                        setDetails(newDetails);
                        setConfirmationDetails(newDetails);
                    }}
                />
                <TextField
                    label="Signature Date"
                    margin="normal"
                    name="name"
                    value={getDateString(new Date())}
                    variant="outlined"
                    type="date"
                    style={{width: '33%', paddingRight: '10px'}}
                    disabled
                />
                {userRole !== 3 &&
                (<>
                    <Divider style={{margin: '20px 0'}} />
                    <Typography
                            color="textSecondary"
                            variant="h4"
                            style={{
                                paddingRight: '30px'
                            }}
                        >
                            {'Sales Confirmation'}
                    </Typography>
                    <Typography
                        color="textSecondary"
                        variant="h6"
                        style={{
                            paddingRight: '30px'
                        }}
                    >
                        {'By typing you full name, you agree to the terms of tis contract'}
                    </Typography>
                    <TextField
                        label="SALES REPRESENTATIVE NAME"
                        margin="normal"
                        name="name"
                        variant="outlined"
                        style={{width: '33%', paddingRight: '10px'}}
                        onChange={(e) => {
                            const newDetails = {
                                ...details,
                                signature_merchant_name: e.currentTarget.value,
                            };
                            setDetails(newDetails);
                            setConfirmationDetails(newDetails);
                        }}
                        value={details.signature_merchant_name}
                    />
                    <TextField
                        label="City, Province"
                        margin="normal"
                        name="name"
                        variant="outlined"
                        style={{width: '33%', paddingRight: '10px'}}
                        value={details.signature_address}
                        disabled
                    />
                    <TextField
                        label="Signature Date"
                        margin="normal"
                        name="name"
                        value={getDateString(new Date())}
                        variant="outlined"
                        type="date"
                        style={{width: '33%', paddingRight: '10px'}}
                        disabled
                    />
                </>
                )}
                <Divider style={{margin: '20px 0'}} />
                <Typography
                        color="textSecondary"
                        variant="h4"
                        style={{
                            paddingRight: '30px'
                        }}
                    >
                        {'Missing Information'}
                </Typography>
                <Typography
                        color="error"
                        variant="body1"
                        style={{
                            paddingRight: '30px'
                        }}
                    >
                        {userRole !== 3 && !Boolean(customerDetails.name) && '- No user has been selected!'}
                        {userRole !== 3 && !Boolean(customerDetails.name) && <br />}
                        {!Boolean(deliveryDetails.conditions_firstdeliverydate) && '- No delivery date has been chosen!'}
                        {!Boolean(deliveryDetails.conditions_firstdeliverydate) && <br />}
                        {userRole !== 3 && !Boolean(paymentDetails.price) && '- The price has not been set!'}
                        {userRole !== 3 && !Boolean(paymentDetails.price) && <br />}
                        {!Boolean(details.signature_merchant_name) && '- Please sign your name (sales representative)!'}
                </Typography>
            </Box>
        </PerfectScrollbar>
  );
};

TermsSelection.propTypes = {
  className: PropTypes.string
};

export default TermsSelection;
