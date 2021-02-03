import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, results, userid, callback, date, isSupplier, ...rest }) => {
    const classes = useStyles();

    const summary = () => {
        let totalPrice = 0;
        let totalPurchasePrice = 0;
        results = results.reduce((r, a) => {
            r[a.form_id] = [...r[a.form_id] || [], a];
            return r;
        }, {});
        results = Object.values(results);

        return results.map((customer, index) => {
            const user = customer[0];
            let count = 1;
            return(
            <div className={index !== 0 ? 'pagebreak' : ''} key={'i' + index} id={'print'+index}>
            <Box key={'n' + index}>
                <h2>{user.firstName + ' ' + user.lastName}</h2>
                <h3>{user.streetAddress + ' ' + user.city + ', ' + user.province + ' ' + user.postalCode}</h3>
            </Box>
            <Table key={'t' + index} style={{marginBottom: '50px'}}>
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
                        Quantity
                    </TableCell>
                    {isSupplier ? (
                        <>
                            <TableCell>
                                Price
                            </TableCell>
                            <TableCell>
                                Sub Total Price
                            </TableCell>
                        </>
                    ) : <></>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {customer.map((product, idx) => {
                        let deliveryNumber = 1;
                        if (product.conditions_seconddeliverydate === date) deliveryNumber = 2;
                        if (product.conditions_thirddeliverydate === date) deliveryNumber = 3;

                        let price = product.point * product.quantity1;
                        if (deliveryNumber === 2) price = product.point * product.quantity2;
                        if (deliveryNumber === 3) price = product.point * product.quantity3;
            
                        totalPrice = totalPrice + price;
                        
                        let purchasePrice = product.purchase_price * product.quantity1;
                        if (deliveryNumber === 2) purchasePrice = product.purchase_price * product.quantity2;
                        if (deliveryNumber === 3) purchasePrice = product.purchase_price * product.quantity3;
                        
                        totalPurchasePrice = totalPurchasePrice + purchasePrice;

                        return product['quantity' + deliveryNumber] > 0 ? (
                            <TableRow
                                hover
                                key={'c' + idx}
                            >
                                <TableCell>
                                    {count++}
                                </TableCell>
                                <TableCell>
                                    {product.code + ' - ' + product.name_en}
                                </TableCell>
                                <TableCell>
                                    {product.type + ' ' + product.quantity}
                                </TableCell>
                                <TableCell
                                style={{textAlign:'center'}}
                                >
                                    {product['quantity' + deliveryNumber]}
                                </TableCell>
                                {isSupplier ? (
                                    <>
                                        <TableCell
                                        style={{textAlign:'right'}}
                                        >
                                            {'$ ' + price.toFixed(2)}
                                        </TableCell>
                                        <TableCell
                                        style={{textAlign:'right'}}
                                        >
                                            {'$ ' + purchasePrice.toFixed(2)}
                                        </TableCell>
                                    </>
                                ) : ''}
                            </TableRow>
                    ) : <></>
                })}
                </TableBody>
                {isSupplier ? (
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
                            <TableCell
                            style={{textAlign:'right'}}
                            >
                            {'$ ' + totalPrice.toFixed(2)}
                            </TableCell>
                            <TableCell
                            style={{textAlign:'right'}}
                            >
                            {'$ ' + totalPurchasePrice.toFixed(2)}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                ) : <></>}
                </Table>
            </div>
            )}
      );
  };

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <PerfectScrollbar>
        <Box minWidth={1050} id='printDiv'>
          {summary()}
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
