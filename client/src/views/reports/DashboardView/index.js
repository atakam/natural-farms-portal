import React, {useEffect, useState} from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Orders from './Orders';
import LatestOrders from './LatestOrders';
import PendingOrders from './PendingOrders';
import MonthOrders from './MonthOrders';
import Customers from './Customers';
import TrafficByProduct from './TrafficByProduct';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const getStatistics = async (setResults) => {
  const response = await fetch('/statistics', {
    headers: {
      'Content-Type': 'application/json',
    }
  });
  const body = await response.text();
  const result = JSON.parse(body);
  console.log("results", JSON.parse(body));
  setResults(result);
};

const Dashboard = () => {
  const classes = useStyles();
  const [results, setResults] = useState(
    {
      monthCount: 0,
      orderCount: 0,
      pendingCount: 0,
      latestOrders: [],
      modifiedOrders: [],
      unModifiedOrders: []
    }
  );

  useEffect(() => {
    getStatistics(setResults);
  }, []);

  return (
    <Page
      className={classes.root}
      title="Dashboard"
    >
      <Container maxWidth={false}>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <Orders count={results.orderCount} />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <MonthOrders count={results.monthCount} />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <PendingOrders count={results.pendingCount} />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <Customers count={results.customerCount} />
          </Grid>
          <Grid
            item
            lg={8}
            md={12}
            xl={9}
            xs={12}
          >
            <LatestOrders orders={results.latestOrders} />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <TrafficByProduct
              modifiedOrders={results.modifiedOrders}
              unModifiedOrders={results.unModifiedOrders}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Dashboard;
