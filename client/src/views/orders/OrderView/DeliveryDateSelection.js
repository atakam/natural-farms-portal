import React, {useState} from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  TextField
} from '@material-ui/core';

const CustomerSelection = ({ className, deliveryDetails, setDeliveryDetails, isCustomer, ...rest }) => {
    const [details, setDetails] = useState(deliveryDetails);

    const getDateString = (d) => {
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = d.getFullYear();

        return yyyy + '-' + mm +'-' + dd;
    }
    return (
        <PerfectScrollbar>
            <Box minWidth={1050}>
                <TextField
                    label="First Delivery Date"
                    margin="normal"
                    name="name"
                    onChange={(e) => {
                        const date1 = new Date(e.currentTarget.value + ' 6:00 pm');
                        const date2 = new Date(e.currentTarget.value + ' 6:00 pm');
                        date2.setDate(date2.getDate() + 90);
                        const date3 = new Date(e.currentTarget.value + ' 6:00 pm');
                        date3.setDate(date3.getDate() + 180);
                        const newDetails = {
                            conditions_firstdeliverydate: getDateString(date1),
                            conditions_seconddeliverydate: getDateString(date2),
                            conditions_thirddeliverydate: getDateString(date3)
                        };
                        setDetails(newDetails);
                        setDeliveryDetails(newDetails);
                    }}
                    value={(details.conditions_firstdeliverydate && details.conditions_firstdeliverydate.split('T')[0]) || new Date()}
                    variant="outlined"
                    type="date"
                    style={{width: '33%', paddingRight: '10px'}}
                    disabled={isCustomer}
                />
                <TextField
                    label="Second Delivery Date"
                    margin="normal"
                    name="name"
                    onChange={(e) => {
                        const date = new Date(e.currentTarget.value + ' 6:00 pm');
                        const newDetails = {
                            ...details,
                            conditions_seconddeliverydate: getDateString(date)
                        };
                        setDetails(newDetails);
                        setDeliveryDetails(newDetails);
                    }}
                    value={(details.conditions_seconddeliverydate && details.conditions_seconddeliverydate.split('T')[0]) || new Date()}
                    variant="outlined"
                    type="date"
                    style={{width: '33%', paddingRight: '10px'}}
                    disabled={isCustomer}
                />
                <TextField
                    label="Third Delivery Date"
                    margin="normal"
                    name="name"
                    onChange={(e) => {
                        const date = new Date(e.currentTarget.value + ' 6:00 pm');
                        const newDetails = {
                            ...details,
                            conditions_thirddeliverydate: getDateString(date)
                        };
                        setDetails(newDetails);
                        setDeliveryDetails(newDetails);
                    }}
                    value={(details.conditions_thirddeliverydate && details.conditions_thirddeliverydate.split('T')[0]) || new Date()}
                    variant="outlined"
                    type="date"
                    style={{width: '33%'}}
                    disabled={isCustomer}
                />
            </Box>
        </PerfectScrollbar>
  );
};

CustomerSelection.propTypes = {
  className: PropTypes.string
};

export default CustomerSelection;
