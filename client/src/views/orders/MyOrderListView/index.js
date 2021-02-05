import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Results from './Results';
import Toolbar from 'src/components/Toolbar';
import AppContext from "src/components/AppContext";
import OrderView from "../OrderView";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const CustomerListView = () => {
  const classes = useStyles();
  const [results, setResults] = useState([]);
  const [openNewOrder, setOpenNewOrder] = useState(false);
  const context = useContext(AppContext);
  const [updates, setUpdates] = useState([]);

  const getOrders = async () => {
    const response = await fetch('/orders/' + context.credentials.user.id, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const body = await response.text();
    const result = JSON.parse(body);
    console.log("results", JSON.parse(body));
    setResults(result);
  
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

  useEffect(() => {
    getOrders();
  }, []);

  const newOrder = () => {
    setOpenNewOrder(true);
  }

  const handleClose = () => {
    setOpenNewOrder(false);
  }

  return (
    <Page
      className={classes.root}
      title="Customers"
    >
      <OrderView
        open={openNewOrder}
        close={handleClose}
        getOrders={getOrders}
        user={context.credentials.user}
      />
      <Container maxWidth={false}>
        <Toolbar buttonProps={{ label: 'NEW ORDER', action: newOrder }}/>
        <Box mt={3}>
          <Results results={results} updates={updates} callback={getOrders} user={context.credentials.user}/>
        </Box>
      </Container>
    </Page>
  );
};

export default CustomerListView;
