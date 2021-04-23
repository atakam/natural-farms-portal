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
import { numberWithCommas } from 'src/utils/utils'

const useStyles = makeStyles((theme) => ({
    root: {},
    avatar: {
        marginRight: theme.spacing(2)
    }
}));

const Results = ({ className, results, userid, callback, date, isSupplier, slotDate, ...rest }) => {
    const classes = useStyles();

    const summary = () => {
        let grandTotalPrice = 0;
        let grandTotalQuantity = 0;
        const summaries = [];

        results = results.reduce((r, a) => {
            r[a.form_id] = [...r[a.form_id] || [], a];
            return r;
        }, {});
        results = Object.values(results);

        const table = results.map((customer, index) => {
            const user = customer[0];
            let count = 1;

            let totalPrice = 0;
            let totalQuantity = 0;

            let deliveryNumber = 1;
            const calDate = new Date(date + 'T04:00:00.000Z');
            const secondDate = new Date(user.conditions_seconddeliverydate);
            const thirdDate = new Date(user.conditions_thirddeliverydate);
            console.log({ date: user.conditions_seconddeliverydate });
            console.log({ calDate });
            console.log({ secondDate });
            console.log({ thirdDate });
            if (secondDate.getTime() == calDate.getTime()) deliveryNumber = 2;
            if (thirdDate.getTime() == calDate.getTime()) deliveryNumber = 3;

            const sector = (user.sector != null ? (' (' + user.sector + ')') : '');
            const grouped = customer.reduce((r, a) => {
                r[a.category_id] = [...r[a.category_id] || [], a];
                return r;
            }, {});
            console.log({ grouped })

            const _summary = {
                name: user.firstName + ' ' + user.lastName,
                address: user.streetAddress + ', ' + user.city + sector + ', ' + user.province + ' ' + user.postalCode,
                totalPrice: 0,
                totalQuantity: 0
            };

            summaries.push(_summary)

            return (
                <div className={index !== 0 ? 'pagebreak' : ''} key={'i' + index} id={'print' + index} className='printArea'>
                    <div className='summary-top-description'>
                        <Box key={'n' + index}>
                            <h3>{'NFF: ' + user.nff}</h3>
                            <h2>{user.firstName + ' ' + user.lastName}</h2>
                            <h3>{user.streetAddress + ', ' + user.city + sector + ', ' + user.province + ' ' + user.postalCode}</h3>
                        </Box>
                        <Box className='align-right'>
                            <h2>
                                {'Delivery Date: ' + slotDate}
                            </h2>
                            <h2>
                                {'Delivery # ' + deliveryNumber}
                            </h2>
                        </Box>
                    </div>
                    <Table key={'t' + index} style={{ marginBottom: '50px' }}>
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
                                        <TableCell className='text-right'>
                                            Price
                            </TableCell>
                                        <TableCell className='text-right'>
                                            Sub Total Price
                            </TableCell>
                                    </>
                                ) : <></>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                Object.values(grouped).map((gcustomer) => {
                                    return gcustomer.map((product, idx) => {

                                        let quantity = product.quantity1;
                                        if (deliveryNumber === 2) quantity = product.quantity2;
                                        if (deliveryNumber === 3) quantity = product.quantity3;

                                        const price = product.point * quantity;

                                        totalPrice += price;
                                        totalQuantity += quantity;

                                        _summary.totalPrice += price;
                                        _summary.totalQuantity += quantity;

                                        grandTotalPrice += price;
                                        grandTotalQuantity += quantity;

                                        const purchasePrice = product.purchase_price * quantity;

                                        return (
                                            <>
                                                {idx === 0 &&
                                                    <TableRow
                                                        hover
                                                        key={'gr' + idx}
                                                    >
                                                        <TableCell colSpan={6} className='summaryCategory'>
                                                            {product.category_name_en.toUpperCase() + ' / ' + product.category_name_fr.toUpperCase()}
                                                        </TableCell>
                                                    </TableRow>
                                                }
                                                {
                                                    product['quantity' + deliveryNumber] > 0 && (
                                                        <TableRow
                                                            hover
                                                            key={'c' + idx}
                                                        >
                                                            <TableCell>
                                                                {count++}
                                                            </TableCell>
                                                            <TableCell>
                                                                {product.code + ' - ' + product.product_name_en}
                                                            </TableCell>
                                                            <TableCell>
                                                                {product.type + ' ' + product.quantity}
                                                            </TableCell>
                                                            <TableCell
                                                                style={{ textAlign: 'center' }}
                                                            >
                                                                {product['quantity' + deliveryNumber]}
                                                            </TableCell>
                                                            {isSupplier && (
                                                                <>
                                                                    <TableCell
                                                                        style={{ textAlign: 'right' }}
                                                                    >
                                                                        {'$ ' + purchasePrice.toFixed(2)}
                                                                    </TableCell>
                                                                    <TableCell
                                                                        style={{ textAlign: 'right' }}
                                                                    >
                                                                        {'$ ' + numberWithCommas(price.toFixed(2))}
                                                                    </TableCell>
                                                                </>
                                                            )}
                                                        </TableRow>
                                                    )
                                                }

                                            </>
                                        )
                                    })
                                })
                            }
                        </TableBody>
                        <TableHead>
                            <TableRow
                                hover
                            >
                                <TableCell
                                >
                                    TOTAL
                        </TableCell>
                                <TableCell />
                                <TableCell />
                                <TableCell style={{ textAlign: 'center' }}>
                                    {totalQuantity}
                                </TableCell>
                                {isSupplier && (
                                    <>
                                        <TableCell />
                                        <TableCell
                                            style={{ textAlign: 'right' }}
                                        >
                                            {'$ ' + numberWithCommas(totalPrice.toFixed(2))}
                                        </TableCell>
                                    </>
                                )}
                            </TableRow>
                        </TableHead>
                    </Table>
                </div>
            )
        });

        return (
            <>
                {table}
                <div className='printArea'>
                    <Table style={{ marginBottom: '50px' }}>
                        <TableHead>
                            <TableRow
                                hover
                            >
                                <TableCell colSpan='3'>
                                    <h1>Summary / Sommaire</h1>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    #
                            </TableCell>
                                <TableCell>
                                    Customer Name
                            </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                    Product Quantity
                            </TableCell>
                                {
                                    isSupplier && (
                                        <TableCell style={{ textAlign: 'right' }}>
                                            Total Price
                                        </TableCell>
                                    )
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                summaries.map((s, indx) => {
                                    return (
                                        <TableRow
                                            hover
                                            key={'sum' + indx}
                                        >
                                            <TableCell>
                                                {indx + 1}
                                            </TableCell>
                                            <TableCell>{s.name}</TableCell>
                                            <TableCell style={{ textAlign: 'center' }}>{s.totalQuantity}</TableCell>
                                            {
                                                isSupplier && (
                                                    <TableCell style={{ textAlign: 'right' }}>{'$ ' + numberWithCommas(s.totalPrice.toFixed(2))}</TableCell>
                                                )
                                            }
                                        </TableRow>
                                    );
                                })
                            }
                        </TableBody>
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={'2'}>TOTAL</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>{grandTotalQuantity}</TableCell>
                                {
                                    isSupplier && (
                                        <TableCell style={{ textAlign: 'right' }}>{'$ ' + numberWithCommas(grandTotalPrice.toFixed(2))}</TableCell>
                                    )
                                }
                            </TableRow>
                        </TableHead>
                    </Table>
                </div>
            </>
        );
    };

    return (
        <Card
            className={clsx(classes.root, className)}
            {...rest}
        >
            <PerfectScrollbar>
                <Box minWidth={1050} >
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
