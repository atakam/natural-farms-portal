import React, {useState} from 'react';
import {
  Box,
  Button,
  Divider
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Tabs from 'src/components/Tabs';
import ProductSelection from './ProductSelection';
import DeliveryDateSelection from './DeliveryDateSelection';
import PaymentSelection from './PaymentSelection';
import ConfirmationSelection from './edit/EditConfirmationSelection';

import {editOrder, insertUpdatedOrderDetails} from 'src/functions';

const EditOrder = ({ className, title, subtitle, updateCallback, cancel, products, currentUser, selectedForm, order, ...rest }) => {
  const [productDetails, setProductDetails] = useState({});
  const [deliveryDetails, setDeliveryDetails] = useState({
    conditions_firstdeliverydate: selectedForm.conditions_firstdeliverydate,
    conditions_seconddeliverydate: selectedForm.conditions_seconddeliverydate,
    conditions_thirddeliverydate: selectedForm.conditions_thirddeliverydate
  });
  const [paymentDetails, setPaymentDetails] = useState({
    price: selectedForm.price,
    rebate: selectedForm.rebate,
    deposit: selectedForm.deposit,
    total: selectedForm.total,
    total_points: selectedForm.total_points
  });
  const [confirmationDetails, setConfirmationDetails] = useState({
    signature_consumer_name: selectedForm.signature_consumer_name,
    signature_merchant_name: selectedForm.signature_merchant_name,
    signature_address: selectedForm.signature_address,
    signature_date: selectedForm.signature_date
  });

  const customerDetails = {
    name: selectedForm.name,
    nff: selectedForm.nff,
    form_id: selectedForm.formid
  };

  const [tabValue, setTabValue] = useState(0);

  const tabs = [
      {
        label: 'SELECT PRODUCTS',
        content: <ProductSelection
                      results={products}
                      productDetails={productDetails}
                      setProductDetails={setProductDetails}
                  />
      },
      {
        label: 'DELIVERY DATES',
        content: <DeliveryDateSelection
                    deliveryDetails={deliveryDetails}
                    setDeliveryDetails={setDeliveryDetails}
                />
      },
      {
        label: 'CONTRACT DETAILS',
        content: <PaymentSelection
                    productDetails={productDetails}
                    paymentDetails={paymentDetails}
                    setPaymentDetails={setPaymentDetails}
                />
      },
      {
        label: 'CONFIRMATION',
        content: <ConfirmationSelection
                    customerDetails={customerDetails}
                    confirmationDetails={confirmationDetails}
                    setConfirmationDetails={setConfirmationDetails}
                    productDetails={productDetails}
                    deliveryDetails={deliveryDetails}
                    paymentDetails={paymentDetails}
                    userRole={currentUser.role}
                    isEdit
                 />
      }
  ];

  if (!selectedForm.isEditAllowed) {
    tabs.splice(0, 1);
  } else {
    tabs.splice(tabs.length - 1, 1);
  }

  const showPrevious = tabValue > 0;
  const showNext = tabValue + 1 < tabs.length;
  const isLast = tabValue === tabs.length -1;

  const getTotalPoints = () => {
    let pts = Object.values(productDetails);
    pts = pts.reduce((r, a) => {
        r[a.points] = [...r[a.points] || [], a];
        return r;
    }, {});
    pts = Object.keys(pts);
    return (pts.reduce((a, b) => Number(a) + Number(b), 0));
  }

  const submit = () => {
    const edited_points = selectedForm.isEditAllowed ? {
      edited_points: getTotalPoints()
    } : {};
    const confirmAndComplete = !selectedForm.isEditAllowed ? {
      confirm: 1,
      status: 1
    } : {};
    const entries = {
      ...customerDetails,
      ...deliveryDetails,
      ...paymentDetails,
      ...confirmationDetails,
      ...edited_points,
      ...confirmAndComplete
    };

    editOrder(entries)
    .then((entry) => {
      if (entry.data.affectedRows && entry.data.affectedRows > 0) {
        Object.keys(productDetails).forEach((key) => {
          insertUpdatedOrderDetails({
            form_id: entry.data.insertId,
            product_details_id: key,
            quantity1: productDetails[key][1],
            quantity2: productDetails[key][2],
            quantity3: productDetails[key][3]
          }).then((response) => {
            console.log(response);
          });
        });
        alert('Successfully updated order!');
        updateCallback();
        cancel();
      } else {
        alert('Error while updating order!');
      }
    });
  }

  const showSubmit = isLast
    && Boolean(deliveryDetails.conditions_firstdeliverydate)
    && Boolean(paymentDetails.price)
    && Boolean(confirmationDetails.signature_merchant_name);

  return (
      <>
          <PerfectScrollbar>
            <Box minWidth={1050} className='create-tabs'>
              <Tabs tabs={tabs} setTabValue={setTabValue} tabValue={tabValue} />
            </Box>
          </PerfectScrollbar>
          <Divider />
          <Box
              className='footer'
              display="flex"
              justifyContent="flex-end"
              p={2}
          >
              {showPrevious && <Button
                  variant="contained"
                  onClick={()=>{setTabValue(tabValue-1)}}
                  style={{marginRight: '10px'}}
              >
                  Previous
              </Button>}
              {showNext && !isLast && <Button
                  color="primary"
                  onClick={()=>{setTabValue(tabValue+1)}}
                  variant="contained"
              >
                  Next
              </Button>}
              {showSubmit && <Button
                  color="primary"
                  onClick={submit}
                  variant="contained"
              >
                  Submit
              </Button>}
          </Box>
      </>
  );
}

export default EditOrder;