import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Results from './Results';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const TemplateListView = () => {
  const classes = useStyles();
  const [results, setResults] = useState([]);

  const getTemplates = async () => {
    const response = await fetch('/templates/email', {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const body = await response.text();
    const result = JSON.parse(body);
    console.log("results", JSON.parse(body));
    setResults(result);
  };

  useEffect(() => {
    getTemplates();
  }, []);

  return (
    <Page
      className={classes.root}
      title="Templates"
    >
      <Container maxWidth={false}>
        <Box mt={3}>
          <Results results={results} callback={getTemplates}/>
        </Box>
      </Container>
    </Page>
  );
};

export default TemplateListView;
