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
import CreateProduct from './CreateProduct';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const ProductListView = () => {
  const classes = useStyles();
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  const getProducts = async () => {
    const response = await fetch('/products', {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const body = await response.text();
    const result = JSON.parse(body);
    console.log("results", result);
    setResults(result);
    setFilteredResults(result);
  };

  const createProduct = () => {
    setProfileDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setProfileDialogOpen(false);
  }

  useEffect(() => {
    getProducts();
  }, []);

  const performSearch = (value) => {
    const filter = value.toUpperCase();

    const newResults = results.filter((el) => {
      const active = el.active === 1 ? 'Active' : 'Not Active';
      if ((String(el.product_name_en) + ' / '+ String(el.product_name_fr)).toUpperCase().indexOf(filter) > -1
        || (String(el.category_name_en) + ' / '+ String(el.category_name_fr)).toUpperCase().indexOf(filter) > -1
        || String(active).toUpperCase().indexOf(filter) > -1
      ) return true;
      return false;
    });
    setFilteredResults(newResults);
  };

  return (
    <Page
      className={classes.root}
      title="Staff"
    >
      <Dialog
        open={profileDialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="draggable-dialog-title"
        fullWidth
        maxWidth={'lg'}
      >
        <CreateProduct
          title={'Create New Product'}
          subtitle={"Create a new product according to available categories"}
          updateCallback={getProducts}
          cancel={handleCloseDialog}
          isStaff
        />
      </Dialog>
      <Container maxWidth={false}>
        <Toolbar performSearch={performSearch} buttonProps={{ label: 'ADD PRODUCT', action: createProduct }} />
        <Box mt={3}>
          <Results results={filteredResults} callback={getProducts}/>
        </Box>
      </Container>
    </Page>
  );
};

export default ProductListView;
