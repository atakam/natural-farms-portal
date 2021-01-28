import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Results from './Results';
import Toolbar from './Toolbar';
import AppContext from "../../../components/AppContext";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const getOrders = async (id, setResults) => {
  const response = await fetch('/orders/', {
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
  const context = useContext(AppContext);

  useEffect(() => {
    getOrders(context.credentials.user.id, setResults);
  }, []);

  return (
    <Page
      className={classes.root}
      title="Customers"
    >
      <Container maxWidth={false}>
        <Toolbar />
        <Box mt={3}>
          <Results results={results} userid={context.credentials.user.id} />
        </Box>
      </Container>
    </Page>
  );
};

export default CustomerListView;
