import React, {useState} from 'react';
import {
  Box,
  Button,
  Divider
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Tabs from 'src/components/Tabs';
import CustomerSelection from './CustomerSelection';
import ProductSelection from './ProductSelection';
import DeliveryDateSelection from './DeliveryDateSelection';
import PaymentSelection from './PaymentSelection';
import TermsSelection from './TermsSelection';
import ConfirmationSelection from './ConfirmationSelection';

import {createOrder, insertOrderDetails, sendEmail} from 'src/functions'

const CreateOrder = ({ className, title, subtitle, updateCallback, cancel, products, customers, currentUser, ...rest }) => {
  const [customerDetails, setCustomerDetails] = useState({});
  const [productDetails, setProductDetails] = useState({});
  const [deliveryDetails, setDeliveryDetails] = useState({});
  const [paymentDetails, setPaymentDetails] = useState({
    price: 0, rebate: 0, deposit: 0, total: 0
  });
  const [termsDetails, setTermsDetails] = useState({policy: false});
  const [confirmationDetails, setConfirmationDetails] = useState({
    signature_consumer_name: '',
    signature_merchant_name: ''
  });

  const [tabValue, setTabValue] = useState(0);

  const tabs = [
      {
          label: 'SELECT USER',
          content: <CustomerSelection
                      results={customers}
                      customerDetails={customerDetails}
                      setCustomerDetails={setCustomerDetails}
                   />
      },
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
        label: 'TERMS & CONDITIONS',
        content: <TermsSelection
                    termsDetails={termsDetails}
                    setTermsDetails={setTermsDetails}
                />
      },
      {
        label: 'CONFIRMATION',
        content: <ConfirmationSelection
                    confirmationDetails={confirmationDetails}
                    setConfirmationDetails={setConfirmationDetails}
                    productDetails={productDetails}
                    customerDetails={customerDetails}
                    deliveryDetails={deliveryDetails}
                    paymentDetails={paymentDetails}
                    termsDetails={termsDetails}
                    userRole={currentUser.role}
                 />
      }
  ];

  const showPrevious = tabValue > 0;
  const showNext = tabValue + 1 < tabs.length;
  const isLast = tabValue === tabs.length -1;

  let disableNext = false;
  if (tabValue === 0) {
    disableNext = !customerDetails.nff;
  }
  if (tabValue === 4) {
    disableNext = !termsDetails.policy;
  }

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
    const total_points = getTotalPoints();
    const entries = {
      ...customerDetails,
      ...deliveryDetails,
      ...paymentDetails,
      ...termsDetails,
      ...confirmationDetails,
      total_points,
      signature_date: getDateString(new Date()),
      representative_id: currentUser.id
    };
    entries.notice = entries.notice || '';

    createOrder(entries)
    .then((entry) => {
      if (entry.data.affectedRows && entry.data.affectedRows > 0) {
        Object.keys(productDetails).forEach((key) => {
          insertOrderDetails({
            form_id: entry.data.insertId,
            product_details_id: key,
            quantity1: productDetails[key][1],
            quantity2: productDetails[key][2],
            quantity3: productDetails[key][3]
          }).then((response) => {
            console.log(response);
          });
        });
        sendEmail({
          id: 1,
          formid: entry.data.insertId,
          name: entries.name,
          email: entries.email,
          phoneNumber: entries.phoneNumber,
          nff: entries.nff,
          repName: currentUser.name,
          repEmail: currentUser.email
        });
        alert('Successfully created order!');
        updateCallback();
        cancel();
      } else {
        alert('Error while creating order!');
      }
    });
  }

  const getDateString = (d) => {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = d.getFullYear();

    return yyyy + '-' + mm +'-' + dd;
  }

  const showSubmit = isLast
    && Boolean(getTotalPoints())
    && Boolean(customerDetails.name)
    && Boolean(deliveryDetails.conditions_firstdeliverydate)
    && Boolean(paymentDetails.price)
    && Boolean(termsDetails.policy);

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
                  disabled={disableNext}
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

export default CreateOrder;