import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Dialog,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Results from './Results';
import Toolbar from 'src/components/Toolbar';
import CreateStaff from './CreateCategory';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const CategoryListView = () => {
  const classes = useStyles();
  const [results, setResults] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const getCategories = async () => {
    const response = await fetch('/categories', {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const body = await response.text();
    const result = JSON.parse(body);
    console.log("results", result);
    setResults(result);
  };

  const createCategory = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  }

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <Page
      className={classes.root}
      title="Staff"
    >
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="draggable-dialog-title"
        fullWidth
        maxWidth={'lg'}
      >
        <CreateStaff
          title={'Create New Category'}
          subtitle={"Create a new product category"}
          updateCallback={getCategories}
          cancel={handleCloseDialog}
          isStaff
        />
      </Dialog>
      <Container maxWidth={false}>
      <Toolbar buttonProps={{ label: 'ADD CATEGORY', action: createCategory }} />
        <Box mt={3}>
          <Results results={results} callback={getCategories}/>
        </Box>
      </Container>
    </Page>
  );
};

export default CategoryListView;
