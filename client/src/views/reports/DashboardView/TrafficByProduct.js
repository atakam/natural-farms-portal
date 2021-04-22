import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  makeStyles,
  colors,
  useTheme
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  }
}));

const TrafficByDevice = ({ className, modifiedOrders, unModifiedOrders, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();

  let products = {};
  const groupProducts = (orders) => {
    orders.forEach((order) => {
      if (products[order.packaging_id]) {
        products[order.packaging_id].count += order.quantity1 + order.quantity2 + order.quantity3;
      } else {
        products[order.packaging_id] = {
          label: order.code + ' - ' + order.name_en + ' [' + order.type + ' - ' + order.quantity + ']',
          count: order.quantity1 + order.quantity2 + order.quantity3
        }
      }
    });
  }
  groupProducts(modifiedOrders);
  groupProducts(unModifiedOrders);

  products = Object.keys(products).map((key) => products[key]).sort(function (a, b) {
    return parseInt(b.count) - parseFloat(a.count);
  }).slice(0, 5);

  const dataNumbers = products.map((prod) => prod.count);
  const dataLabels = products.map((prod) => prod.label);

  const data = {
    datasets: [
      {
        data: dataNumbers,
        backgroundColor: [
          colors.indigo[500],
          colors.red[600],
          colors.orange[600],
          colors.yellow[600],
          colors.green[600]
        ],
        borderWidth: 8,
        borderColor: colors.common.white,
        hoverBorderColor: colors.common.white
      }
    ],
    labels: dataLabels
  };

  const options = {
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    legend: {
      display: false
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.default,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }
  };

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader title="Most sold product" />
      <Divider />
      <CardContent>
        <Box
          height={300}
          position="relative"
        >
          <Doughnut
            data={data}
            options={options}
          />
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          mt={2}
        >
          <PerfectScrollbar>
            <Box minWidth={800}>
              <Table className={'top-products'}>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      Product Name
                    </TableCell>
                    <TableCell>
                      Quantity
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product, index) => (
                    <TableRow
                      hover
                      key={index}
                    >
                      <TableCell>
                        {product.label}
                      </TableCell>
                      <TableCell>
                        {product.count}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </PerfectScrollbar>
        </Box>
      </CardContent>
    </Card>
  );
};

TrafficByDevice.propTypes = {
  className: PropTypes.string
};

export default TrafficByDevice;
