import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@material-ui/core';
import Tabs from 'src/components/Tabs';

const ProductSelection = ({ className, productDetails, setProductDetails, results, ...rest }) => {
    const [details, setDetails] = useState(productDetails);
    const [points, setPoints] = useState({});
    const [total_points, setTotalPoints] = useState(0);

    useEffect(() => {
        let pts = Object.values(productDetails);
        pts = pts.reduce((r, a) => {
            r[a.points] = [...r[a.points] || [], a];
            return r;
        }, {});
        pts = Object.keys(pts);
        setTotalPoints(pts.reduce((a, b) => Number(a) + Number(b), 0));
      }, [productDetails]);

    results = results.reduce((r, a) => {
        r[a.category_id] = [...r[a.category_id] || [], a];
        return r;
    }, {});
    results = Object.values(results);
    const updatePoints = (pid, point) => {
        const v1 = document.getElementsByName('quantity_' + pid + '_1')[0].value;
        const v2 = document.getElementsByName('quantity_' + pid + '_2')[0].value;
        const v3 = document.getElementsByName('quantity_' + pid + '_3')[0].value;
        
        setPoints({
            ...points,
            [pid]: (Number(v1) + Number(v2) + Number(v3)) * point
        });
    }

    const getTabProducts = () => {
      return results.map((result, index) => {
        return {
            label: result[0].category_name_en,
            content: <Table key={index}>
                        <TableHead>
                        <TableRow>
                            <TableCell>
                            Product Name
                            </TableCell>
                            <TableCell>
                            Code
                            </TableCell>
                            <TableCell>
                            Size
                            </TableCell>
                            <TableCell>
                            1st Delivery
                            </TableCell>
                            <TableCell>
                            2nd Delivery
                            </TableCell>
                            <TableCell>
                            3rd Delivery
                            </TableCell>
                            <TableCell>
                            Points
                            </TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {result.map((product, idx) => (
                            <TableRow
                            hover
                            key={idx}
                            >
                            <TableCell>
                                {product.name_en + ' / ' + product.name_fr}
                            </TableCell>
                            <TableCell>
                                {product.code}
                            </TableCell>
                            <TableCell>
                                {product.type + ' / ' + product.quantity}
                            </TableCell>
                            <TableCell>
                                <TextField
                                    margin="normal"
                                    name={'quantity_' + product.product_details_id + '_1'}
                                    onChange={(e) => {
                                        updatePoints(product.product_details_id, product.point);
                                        const q1 = Number(e.target.value);
                                        const q2 = (details[product.product_details_id] && details[product.product_details_id][2]) || 0;
                                        const q3 = (details[product.product_details_id] && details[product.product_details_id][3]) || 0;
                                        const rowPoint = (Number(q1) + Number(q2) + Number(q3)) * product.point;
                                        const newDetails = {
                                            ...details,
                                            [product.product_details_id]: {
                                                1: q1,
                                                2: q2,
                                                3: q3,
                                                points: rowPoint
                                            }
                                        };
                                        setDetails(newDetails);
                                        setProductDetails(newDetails);
                                    }}
                                    type="number"
                                    value={(details[product.product_details_id] && details[product.product_details_id][1]) || 0}
                                    variant="outlined"
                                    InputProps={{ inputProps: { min: 0, style: {width: '50px'} } }} />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    margin="normal"
                                    name={'quantity_' + product.product_details_id + '_2'}
                                    onChange={(e) => {
                                        updatePoints(product.product_details_id, product.point);
                                        const q1 = (details[product.product_details_id] && details[product.product_details_id][1]) || 0;
                                        const q2 = Number(e.target.value);
                                        const q3 = (details[product.product_details_id] && details[product.product_details_id][3]) || 0;
                                        const rowPoint = (Number(q1) + Number(q2) + Number(q3)) * product.point;
                                        const newDetails = {
                                            ...details,
                                            [product.product_details_id]: {
                                                1: q1,
                                                2: q2,
                                                3: q3,
                                                points: rowPoint
                                            }
                                        }
                                        setDetails(newDetails);
                                        setProductDetails(newDetails);
                                    }}
                                    type="number"
                                    value={(details[product.product_details_id] && details[product.product_details_id][2]) || 0}
                                    variant="outlined"
                                    InputProps={{ inputProps: { min: 0, style: {width: '50px'} } }}
                                    />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    margin="normal"
                                    name={'quantity_' + product.product_details_id + '_3'}
                                    onChange={(e) => {
                                        updatePoints(product.product_details_id, product.point);
                                        const q1 = (details[product.product_details_id] && details[product.product_details_id][1]) || 0;
                                        const q2 = (details[product.product_details_id] && details[product.product_details_id][2]) || 0;
                                        const q3 = Number(e.target.value);
                                        const rowPoint = (Number(q1) + Number(q2) + Number(q3)) * product.point;
                                        const newDetails = {
                                            ...details,
                                            [product.product_details_id]: {
                                                1: q1,
                                                2: q2,
                                                3: q3,
                                                points: rowPoint
                                            }
                                        };
                                        setDetails(newDetails);
                                        setProductDetails(newDetails);
                                    }}
                                    type="number"
                                    value={(details[product.product_details_id] && details[product.product_details_id][3]) || 0}
                                    variant="outlined"
                                    InputProps={{ inputProps: { min: 0, style: {width: '50px'} } }}
                                />
                            </TableCell>
                            <TableCell>
                                {(details[product.product_details_id] && details[product.product_details_id].points) || 0}
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
        }
      });
  }

  return (
    <PerfectScrollbar>
        <Box minWidth={1050}>
            <Tabs
                className='subheader'
                tabs={getTabProducts()}
                indicatorColor="primary"
                textColor="primary"
                appBarColor="default"
                displayText={
                    <Typography
                        color="textSecondary"
                        variant="h3"
                        style={{
                            float: 'right',
                            textAlign: 'right',
                            paddingRight: '30px'
                        }}
                    >
                        {'Total Points: ' + total_points}
                    </Typography>}
            />
        </Box>
    </PerfectScrollbar>
  );
};

ProductSelection.propTypes = {
  className: PropTypes.string
};

export default ProductSelection;
