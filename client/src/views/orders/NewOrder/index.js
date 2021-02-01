import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {
  Dialog
} from '@material-ui/core';
import CreateOrder from './CreateOrder';

const NewOrder = ({ className, open, close, getOrders, user, ...rest }) => {
    const [results, setResults] = useState([]);

    useEffect(() => {
        getProductDetails();
    }, []);

    const getProductDetails = async () => {
        const response = await fetch('/productdetails', {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const body = await response.text();
        const result = JSON.parse(body);
        console.log("results", JSON.parse(body));
        setResults(result);
    };
    return (
        <Dialog
            open={open}
            onClose={close}
            aria-labelledby="draggable-dialog-title"
            fullWidth
            maxWidth={'lg'}
        >
            <CreateOrder
                title={'Create New Order'}
                subtitle={""}
                updateCallback={getOrders}
                cancel={close}
                user={user}
                results={results}
            />
        </Dialog>
  );
};

NewOrder.propTypes = {
  className: PropTypes.string
};

export default NewOrder;
