import React, { useState, useContext, useEffect } from 'react';
import moment from 'moment';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Results from './Results';
import Toolbar from 'src/components/Toolbar';
import AppContext from "src/components/AppContext";

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

  const newOrder = () => {};

  const edited = (customer) => {
    if (updates.includes(customer.formid)) {
      if (customer.edited_status === 1) return 'Approved';
      else if (customer.edited === 1) return 'Pending';
    }
    else return '-';
  };

  const status = (customer) => {
    if ((customer.confirm3 === 1 && customer.deliver3 === 0)) return 'Confirm (3)';
    else if ((customer.confirm2 === 1 && customer.deliver2 === 0)) return 'Confirm (2)';
    else if ((customer.confirm1 === 1 && customer.deliver1 === 0)) return 'Confirm (1)';
    
    else if ((customer.confirm1 === 0 && customer.deliver1 === 0)) return 'Not Confirm (1)';
    else if ((customer.confirm1 === 1 && customer.deliver1 === 1) && 
    (customer.confirm2 === 0 && customer.deliver2 === 0)) return 'Not Confirm (2)';
    else if ((customer.confirm1 === 1 && customer.deliver1 === 1) && 
    (customer.confirm2 === 1 && customer.deliver2 === 1) &&
    (customer.confirm3 === 0 && customer.deliver3 === 0)) return 'Not Confirm (3)';

    else if ((customer.confirm1 === 1 && customer.deliver1 === 1) && 
    (customer.confirm2 === 1 && customer.deliver1 === 1) &&
    (customer.confirm3 === 1 && customer.deliver1 === 1)) return 'Expired';

    else return 'Unkwon';
  };

  const delivery = (customer) => {
    if (customer.deliver1 === 0) return moment(customer.conditions_firstdeliverydate).format('DD/MM/YYYY') + " (1st)";
    else if (customer.deliver2 === 0) return moment(customer.conditions_seconddeliverydate).format('DD/MM/YYYY') + " (2nd)";
    else if (customer.deliver3 === 0) return moment(customer.conditions_thirddeliverydate).format('DD/MM/YYYY') + " (3rd)";
    else return "No Delivery";
  };

  const performSearch = (value) => {
    const filter = value.toUpperCase();

    const newResults = results.filter((el) => {
      if (String(el.nff).toUpperCase().indexOf(filter) > -1
        || (String(el.firstName) + ' ' + String(el.lastName)).toUpperCase().indexOf(filter) > -1
        || String(el.signature_date).toUpperCase().indexOf(filter) > -1
        || String(el.price).toUpperCase().indexOf(filter) > -1
        || String(el.total_points).toUpperCase().indexOf(filter) > -1
        || String(el.repName).toUpperCase().indexOf(filter) > -1
        || edited(el).toUpperCase().indexOf(filter) > -1
        || status(el).toUpperCase().indexOf(filter) > -1
        || delivery(el).toUpperCase().indexOf(filter) > -1
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
      <Toolbar performSearch={performSearch} buttonProps={{ label: 'NEW ORDER', action: newOrder }}/>
        <Box mt={3}>
          <Results updates={updates} results={filteredResults} userid={context.credentials.user.id} callback={getOrders} />
        </Box>
      </Container>
    </Page>
  );
};

export default CustomerListView;
