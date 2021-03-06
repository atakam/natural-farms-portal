import React, { useState } from 'react';
import clsx from 'clsx';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
  Divider
} from '@material-ui/core';
import Tabs from 'src/components/Tabs';
import { updateOrder } from 'src/functions/index';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, results, userid, callback, isCustomer, emailProps, ...rest }) => {
  const classes = useStyles();

  const delivery = (number) => {
      let totalPoints = 0;
      let totalPurchasePrice = 0;
      return (
        <Table>
            <TableHead>
                <TableRow>
                <TableCell>
                    #
                </TableCell>
                <TableCell>
                    Product Name
                </TableCell>
                <TableCell>
                    Packaging
                </TableCell>
                <TableCell>
                    Unit Point Value
                </TableCell>
                <TableCell>
                    Quantity
                </TableCell>
                <TableCell>
                    Total Points
                </TableCell>
                {!isCustomer && <TableCell>
                    Supplier Total
                </TableCell>}
                </TableRow>
            </TableHead>
            <TableBody>
                {results.map((product, index) => {
                    let delpoints = product.point * product.quantity1;
                    if (number === 2) delpoints = product.point * product.quantity2;
                    if (number === 3) delpoints = product.point * product.quantity3;
        
                    totalPoints = totalPoints + delpoints;
                    
                    let purchasePrice = product.purchase_price * product.quantity1;
                    if (number === 2) purchasePrice = product.purchase_price * product.quantity2;
                    if (number === 3) purchasePrice = product.purchase_price * product.quantity3;
                    
                    totalPurchasePrice = totalPurchasePrice + purchasePrice;
                    
                    return (
                    <TableRow
                        hover
                        key={index}
                    >
                        <TableCell>
                        {index + 1}
                        </TableCell>
                        <TableCell>
                        {product.code + ' - ' + product.name_en}
                        </TableCell>
                        <TableCell>
                        {product.type + ' ' + product.quantity}
                        </TableCell>
                        <TableCell style={{textAlign:'center'}}>
                        {product.point}
                        </TableCell>
                        <TableCell style={{textAlign:'center'}}
                        >
                        {number === 2 ? product.quantity2 : (number === 3 ? product.quantity3 : product.quantity1)}
                        </TableCell>
                        <TableCell
                        style={{textAlign:'center'}}
                        >
                        {delpoints}
                        </TableCell>
                        {!isCustomer && <TableCell
                        style={{textAlign:'center'}}
                        >
                        {'$ ' + purchasePrice.toFixed(2)}
                        </TableCell>}
                    </TableRow>
                    );
                })}
            </TableBody>
            <TableHead>
                <TableRow
                    hover
                >
                    <TableCell
                    rowSpan={3}
                    >
                    TOTAL
                    </TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell />
                    <TableCell />
                    <TableCell
                    style={{textAlign:'center'}}
                    >
                    {totalPoints}
                    </TableCell>
                    {!isCustomer && <TableCell
                    style={{textAlign:'center'}}
                    >
                    {'$ ' + totalPurchasePrice.toFixed(2)}
                    </TableCell>}
                </TableRow>
            </TableHead>
            </Table>
      );
  };

  const actions = (number) => {
    let numberLabel = "FIRST";
    if (number === 2) numberLabel = 'SECOND';
    if (number === 3) numberLabel = 'THIRD';
    return (
        <Formik
            enableReinitialize
            initialValues={{
                ['confirm' + number]: results[0] ? results[0]['confirm' + number] === 1 : false,
                ['deliver' + number]: results[0] ? results[0]['deliver' + number] === 1 : false,
                ['sendEmail' + number]: false
            }}
            onSubmit={(values) => {
                values = {
                    ...values,
                    ['confirm' + number]: values['confirm' + number] ? 1 : 0,
                    ['deliver' + number]: values['deliver' + number] ? 1 : 0
                };
                const confirmStr = values['confirm' + number] ? 'Confirmed' : 'Not Confirmed';
                const deliverStr = values['confirm' + number] ? (values['deliver' + number] ? ' - Delivered' : ' - Not Delivered') : '';
                const deliveryDate = emailProps['delivery' + number];
                const shouldSendEmail = values['sendEmail' + number];
                updateOrder({
                    entries: {
                        ...values,
                        ...emailProps,
                        deliveryNumber: number,
                        deliveryStatus: confirmStr + deliverStr,
                        deliveryDate,
                        shouldSendEmail
                    },
                    formid: results[0].form_id})
                .then(() => callback());
                console.log(values);
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Checkbox
                    checked={values['confirm' + number]}
                    name={'confirm' + number}
                    onChange={handleChange}
                />
                <Typography
                    color="textSecondary"
                    variant="body1"
                    style={{display: 'inline-block'}}
                >
                    {'Confirmed ' + numberLabel +' delivery'}
                </Typography>

                <Checkbox
                    checked={values['deliver' + number]}
                    name={'deliver' + number}
                    onChange={handleChange}
                    style={{marginLeft: '40px'}}
                />
                <Typography
                    color="textSecondary"
                    variant="body1"
                    style={{display: 'inline-block'}}
                >
                    {'Delivered ' + numberLabel +' delivery'}
                </Typography>

                <Checkbox
                    checked={values['sendEmail' + number]}
                    name={'sendEmail' + number}
                    onChange={handleChange}
                    style={{marginLeft: '40px'}}
                />
                <Typography
                    color="textSecondary"
                    variant="body1"
                    style={{display: 'inline-block'}}
                >
                    {'Send confirmation email'}
                </Typography>
                
                <Box
                    display="inline-flex"
                    p={2}
                >
                    <Button
                        color="primary"
                        type="submit"
                        variant="contained"
                    >
                    Submit
                    </Button>
                </Box>
                <Divider />
              </form>
            )}
        </Formik>
    );
  };

  const tabs = [
      {
          label: 'First Delivery',
          content: delivery(1),
          actions: actions(1)
      },
      {
        label: 'Second Delivery',
        content: delivery(2),
        actions: actions(2)
      },
      {
        label: 'Third Delivery',
        content: delivery(3),
        actions: actions(3)
      }
  ];

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <PerfectScrollbar>
        <Box minWidth={1050}>
          <Tabs tabs={tabs} isCustomer={isCustomer}/>
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  results: PropTypes.array.isRequired,
  id: PropTypes.number,
  callback: PropTypes.func
};

export default Results;
