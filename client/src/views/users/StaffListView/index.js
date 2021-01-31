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
import CreateStaff from './CreateStaff';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const StaffListView = () => {
  const classes = useStyles();
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  const filter = (text) => {
    const newResults = results.filter((el) => {
      for (let i=0; i<Object.values(el).length; i++) {
          if (String(Object.values(el)[i]).toLowerCase().indexOf(text.toLowerCase()) > -1) return true;
      }
      return false;
    });
    setFilteredResults(newResults);
  };

  const getStaff = async () => {
    const response = await fetch('/staff', {
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

  const createStaff = () => {
    setProfileDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setProfileDialogOpen(false);
  }

  useEffect(() => {
    getStaff();
  }, []);

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
        <CreateStaff
          title={'Create New Staff'}
          subtitle={"Create an administrator, supplier, delivery rep and sales rep account"}
          updateCallback={getStaff}
          cancel={handleCloseDialog}
          isStaff
        />
      </Dialog>
      <Container maxWidth={false}>
        <Toolbar filter={filter} buttonProps={{ label: 'ADD STAFF', action: createStaff }} />
        <Box mt={3}>
          <Results results={filteredResults} callback={getStaff}/>
        </Box>
      </Container>
    </Page>
  );
};

export default StaffListView;
