import React, {useEffect, useState, useContext} from 'react';
import PropTypes from 'prop-types';
import {
  Dialog
} from '@material-ui/core';
import CreateOrder from './CreateOrder';
import AppContext from "src/components/AppContext";

const NewOrder = ({ className, open, close, getOrders, user, ...rest }) => {
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);

    const context = useContext(AppContext);

    useEffect(() => {
        getProductDetails();
        getCustomers();
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
        setProducts(result);
    };

    const getCustomers = async () => {
        const response = await fetch('/users', {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const body = await response.text();
        const result = JSON.parse(body);
        console.log("results", JSON.parse(body));
        setCustomers(result);
    };
    return (
        <Dialog
            open={open}
            onClose={close}
            aria-labelledby="draggable-dialog-title"
            fullWidth
            maxWidth={'xl'}
        >
            <CreateOrder
                title={'Create New Order'}
                subtitle={""}
                updateCallback={getOrders}
                cancel={close}
                user={user}
                products={products}
                customers={customers}
                currentUser={context.credentials.user}
            />
        </Dialog>
  );
};

NewOrder.propTypes = {
  className: PropTypes.string
};

export default NewOrder;
