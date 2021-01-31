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

const CustomerListView = (props) => {
  const classes = useStyles();
  const [results, setResults] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const context = useContext(AppContext);

  const filter = (text) => {
    const newResults = results.filter((el) => {
      for (let i=0; i<Object.values(el).length; i++) {
          if (String(Object.values(el)[i]).toLowerCase().indexOf(text.toLowerCase()) > -1) return true;
      }
      return false;
    });
    setFilteredResults(newResults);
  };

  const getOrders = async (isModified) => {
    const response = isModified ? (
      await fetch('/ordersmodified', {
        headers: {
          'Content-Type': 'application/json',
        }
      })
    ) : (
      await fetch('/orders', {
        headers: {
          'Content-Type': 'application/json',
        }
      })
    );

    const updated = await fetch('/orderscheck/updated', {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const body = await response.text();
    const result = JSON.parse(body);
    console.log("results", JSON.parse(body));
    setResults(result);
    setFilteredResults(result);

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
    getOrders(props.isModified);
  }, [props.isModified]);

  return (
    <Page
      className={classes.root}
      title="Customers"
    >
      <Container maxWidth={false}>
        <Toolbar filter={filter} />
        <Box mt={3}>
          <Results updates={updates} results={filteredResults} userid={context.credentials.user.id} callback={getOrders} />
        </Box>
      </Container>
    </Page>
  );
};

export default CustomerListView;
