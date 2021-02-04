import React, {useState} from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Divider,
  TextField,
  Typography
} from '@material-ui/core';

const TermsSelection = ({ className, deliveryDetails, termsDetails, paymentDetails, customerDetails, productDetails, confirmationDetails, setConfirmationDetails, results, userRole, ...rest }) => {
    const [details, setDetails] = useState(confirmationDetails);

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
                    value={customerDetails.signature_address}
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
                        label="MERCHANT FULL NAME"
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
                        value={customerDetails.signature_address}
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
                        {!Boolean(customerDetails.name) && '- No user has been selected!'}
                        {!Boolean(customerDetails.name) && <br />}
                        {!total_points && '- Total Points is 0. This implies no product was selected!'}
                        {!total_points && <br />}
                        {!Boolean(deliveryDetails.conditions_firstdeliverydate) && '- No delivery date has been chosen!'}
                        {!Boolean(deliveryDetails.conditions_firstdeliverydate) && <br />}
                        {!Boolean(paymentDetails.price) && '- The price has not been set!'}
                        {!Boolean(paymentDetails.price) && <br />}
                        {!Boolean(termsDetails.policy) && '- The terms and conditions have not been accpeted!'}
                        {!Boolean(termsDetails.policy) && <br />}
                </Typography>
            </Box>
        </PerfectScrollbar>
  );
};

TermsSelection.propTypes = {
  className: PropTypes.string
};

export default TermsSelection;
