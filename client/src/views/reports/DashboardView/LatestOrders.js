import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  makeStyles
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

const useStyles = makeStyles(() => ({
  root: {},
  actions: {
    justifyContent: 'flex-end'
  }
}));

const getUpdates = async (setUpdates) => {
  const updated = await fetch('/orderscheck/updated', {
    headers: {
      'Content-Type': 'application/json',
    }
  });
  const body2 = await updated.text();
    let update = JSON.parse(body2);
    update = update.map(a => a.form_id);
    update = update.filter(function(item, pos) {
        return update.indexOf(item) == pos;
    })
    console.log("updates", update);
    setUpdates(update);
};

const LatestOrders = ({ className, orders, ...rest }) => {
  const classes = useStyles();
  const [updates, setUpdates] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    getUpdates(setUpdates);
  }, []);

  const edited = (customer) => {
    if (updates.includes(customer.formid)) {
      if (customer.edited_status === 1) return (
        <Chip
          color="primary"
          label='Approved'
          size="small"
        />
      );
      else if (customer.edited === 1) return (
        <Chip
          color="secondary"
          label='Pending'
          size="small"
        />
      );
    }
    else return '-';
  };

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader title="Latest Orders" />
      <Divider />
      <PerfectScrollbar>
        <Box minWidth={800}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  NFF
                </TableCell>
                <TableCell>
                  Customer
                </TableCell>
                <TableCell>
                  Date
                </TableCell>
                <TableCell>
                  Total Points
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order, index) => (
                <TableRow
                  hover
                  key={index}
                >
                  <TableCell>
                    {order.nff}
                  </TableCell>
                  <TableCell>
                    {order.firstName + ' ' + order.lastName}
                  </TableCell>
                  <TableCell>
                    {moment(order.signature_date).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell>
                    {order.total_points}
                  </TableCell>
                  <TableCell>
                    {edited(order)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <Box
        display="flex"
        justifyContent="flex-end"
        p={2}
      >
        <Button
          color="primary"
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
          onClick={ () => {
            navigate('/app/allorders', { replace: true });
          }}
        >
          View all
        </Button>
      </Box>
    </Card>
  );
};

LatestOrders.propTypes = {
  className: PropTypes.string
};

export default LatestOrders;
