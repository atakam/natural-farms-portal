import React, {useEffect, useState, useContext} from 'react';
import PropTypes from 'prop-types';
import {
  Dialog
} from '@material-ui/core';
import CreateOrder from './CreateOrder';
import CreateOrderCustomer from './CreateOrderCustomer';
import EditOrder from './EditOrder';
import AppContext from "src/components/AppContext";

const OrderView = ({ className, open, close, getOrders, user, isEdit, formId, updates, selectedForm, ...rest }) => {
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [order, setOrder] = useState([]);

    const context = useContext(AppContext);

    useEffect(() => {
        getProductDetails();
        getCustomers();
        selectedForm && selectedForm.isEditAllowed && getOrdersByFormId();
    }, [selectedForm, isEdit]);

    const getOrdersByFormId = async () => {
      const url = selectedForm.isEdited ? '/orders_details/update/' : '/orders_details/';
      const response = await fetch(url + selectedForm.formid, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const body = await response.text();
      const result = JSON.parse(body);
      console.log("results", JSON.parse(body));
      setOrder(result);
  }

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
          {isEdit ? (
            context.credentials.user.role !== 3 ? 
              <EditOrder
                title={'Edit Order'}
                subtitle={""}
                updateCallback={getOrders}
                cancel={close}
                user={user}
                products={products}
                order={order}
                currentUser={context.credentials.user}
                selectedForm={selectedForm}
              /> :
            <></>
          ) : (
            context.credentials.user.role !== 3 ?
              <CreateOrder
                  title={'Create New Order'}
                  subtitle={""}
                  updateCallback={getOrders}
                  cancel={close}
                  user={user}
                  products={products}
                  customers={customers}
                  currentUser={context.credentials.user}
              /> :
              <CreateOrderCustomer
                  title={'Create New Order'}
                  subtitle={""}
                  updateCallback={getOrders}
                  cancel={close}
                  user={user}
                  products={products}
                  currentUser={context.credentials.user}
              />
          )}
        </Dialog>
  );
};

OrderView.propTypes = {
  className: PropTypes.string
};

export default OrderView;
