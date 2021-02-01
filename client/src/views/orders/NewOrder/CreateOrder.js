import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField
} from '@material-ui/core';

const CreateOrder = ({ className, title, subtitle, id, updateCallback, cancel, results, ...rest }) => {
  let points = {};
  const updatePoints = (pid, point) => {
    const v1 = document.getElementsByName('quantity_' + pid + '_1')[0].value;
    const v2 = document.getElementsByName('quantity_' + pid + '_2')[0].value;
    const v3 = document.getElementsByName('quantity_' + pid + '_3')[0].value;
    points[pid] = (Number(v1) + Number(v2) + Number(v3)) * point;
  }
  
  const getPoints = (pid) => {
    return points[pid] || 0;
  }

  return (
    <Container maxWidth="xl">
      <Card>
          <CardHeader
            subheader={subtitle}
            title={title}
          />
          <Divider />
          <CardContent>
          <Formik
            initialValues={{}}
            onSubmit={(values) => {
              console.log(values);
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <PerfectScrollbar>
                  <Box minWidth={1050}>
                    <Table>
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
                        {results.map((product, index) => (
                          <TableRow
                            hover
                            key={index}
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
                                onBlur={handleBlur}
                                onChange={(e) => {
                                  updatePoints(product.product_details_id, product.point);
                                  handleChange(e);
                                }}
                                type="number"
                                value={values['quantity_' + product.product_details_id + '_1'] || 0}
                                variant="outlined"
                                InputProps={{ inputProps: { min: 0 } }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                margin="normal"
                                name={'quantity_' + product.product_details_id + '_2'}
                                onBlur={handleBlur}
                                onChange={(e) => {
                                  updatePoints(product.product_details_id, product.point);
                                  handleChange(e);
                                }}
                                type="number"
                                value={values['quantity_' + product.product_details_id + '_2'] || 0}
                                variant="outlined"
                                InputProps={{ inputProps: { min: 0 } }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                margin="normal"
                                name={'quantity_' + product.product_details_id + '_3'}
                                onBlur={handleBlur}
                                onChange={(e) => {
                                  updatePoints(product.product_details_id, product.point);
                                  handleChange(e);
                                }}
                                type="number"
                                value={values['quantity_' + product.product_details_id + '_3'] || 0}
                                variant="outlined"
                                InputProps={{ inputProps: { min: 0 } }}
                              />
                            </TableCell>
                            <TableCell>
                              {getPoints(product.product_details_id)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </PerfectScrollbar>
              </form>)}
          </Formik>
        </CardContent>
      </Card>
    </Container>
  );
};

CreateOrder.propTypes = {
  className: PropTypes.string
};

export default CreateOrder;
