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

const getOrders = async (id, setResults) => {
  const response = await fetch('/orders/' + id, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
  const body = await response.text();
  const result = JSON.parse(body);
  console.log("results", JSON.parse(body));
  setResults(result);
};

const CustomerListView = () => {
  const classes = useStyles();
  const [results, setResults] = useState([]);
  const [openNewOrder, setOpenNewOrder] = useState(false);
  const context = useContext(AppContext);

  useEffect(() => {
    getOrders(context.credentials.user.id, setResults);
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
        getOrders={() => getOrders(context.credentials.user.id, setResults)}
        user={context.credentials.user}
      />
      <Container maxWidth={false}>
        <Toolbar buttonProps={{ label: 'NEW ORDER', action: newOrder }}/>
        <Box mt={3}>
          <Results results={results} />
        </Box>
      </Container>
    </Page>
  );
};

export default CustomerListView;
