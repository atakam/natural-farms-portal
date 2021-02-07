import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Results from './Results';
import Toolbar from 'src/components/Toolbar';

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
  const [filteredResults, setFilteredResults] = useState([]);

  const getCustomers = async () => {
    const response = await fetch('/users', {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const body = await response.text();
    const result = JSON.parse(body);
    console.log("results", JSON.parse(body));
    setResults(result);
    setFilteredResults(result);
  };

  useEffect(() => {
    getCustomers();
  }, []);

  const performSearch = (value) => {
    const filter = value.toUpperCase();

    const newResults = results.filter((el) => {
      const sector = (el.sector != null ? (' (' + el.sector + ')') : '');
      if ((String(el.firstName) + ' '+ String(el.lastName)).toUpperCase().indexOf(filter) > -1
        || (String(el.streetAddress) + ', '+ String(el.city) + sector + ', '+ String(el.province)+ ' '+ String(el.postalCode)).toUpperCase().indexOf(filter) > -1
        || String(el.nff).toUpperCase().indexOf(filter) > -1
        || String(el.email).toUpperCase().indexOf(filter) > -1
        || String(el.phoneNumber).toUpperCase().indexOf(filter) > -1
      ) return true;
      return false;
    });
    setFilteredResults(newResults);
  };

  return (
    <Page
      className={classes.root}
      title="Customers"
    >
      <Container maxWidth={false}>
        <Toolbar performSearch={performSearch}/>
        <Box mt={3}>
          <Results results={filteredResults} callback={getCustomers}/>
        </Box>
      </Container>
    </Page>
  );
};

export default CustomerListView;
