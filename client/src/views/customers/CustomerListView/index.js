import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Results from './Results';
import Toolbar from './Toolbar';

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

  const filter = (text) => {
    const newResults = results.filter((el) => {
      for (let i=0; i<Object.values(el).length; i++) {
          if (String(Object.values(el)[i]).toLowerCase().indexOf(text.toLowerCase()) > -1) return true;
      }
      return false;
    });
    setFilteredResults(newResults);
  };

  const getCustomers = async () => {
    const response = await fetch('/users/:3', {
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

  return (
    <Page
      className={classes.root}
      title="Customers"
    >
      <Container maxWidth={false}>
        <Toolbar filter={filter} />
        <Box mt={3}>
          <Results results={filteredResults} callback={getCustomers}/>
        </Box>
      </Container>
    </Page>
  );
};

export default CustomerListView;
