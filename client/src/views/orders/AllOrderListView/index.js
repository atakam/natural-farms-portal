import React, { useState, useContext, useEffect } from 'react';
import moment from 'moment';
import {
  Box,
  Container,
  MenuItem,
  TextField,
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

const CustomerListView = (props) => {
  const classes = useStyles();
  const [results, setResults] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [openNewOrder, setOpenNewOrder] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const [calendarView, setCalendarView] = useState(false);
  const [filterValue, setFilterValue] = useState('all');
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
    update = update.filter(function (item, pos) {
      return update.indexOf(item) == pos;
    })
    console.log("updates", update);
    setUpdates(update);
  };

  useEffect(() => {
    getOrders(props.isModified);
  }, [props.isModified]);

  const edited = (customer) => {
    if (updates.includes(customer.formid)) {
      if (customer.status === 1) return 'Approved';
      else return 'Pending';
    }
    else return '-';
  };

  const isPending = (customer) => {
    if (updates.includes(customer.formid)) {
      return customer.status === 0;
    }
    else return false;
  };

  const status = (customer) => {
    if (customer.signature_consumer_name === '') {
      return 'Customer Signature';
    } else if (customer.signature_merchant_name === '') {
      return 'Sales Signature';
    } else if (customer.deliver3 === 1) return 'Expired';
    else if (customer.confirm3 === 1) return 'Confirm (3)';
    else if (customer.deliver2 === 1) return 'Not Confirm (3)';
    else if (customer.confirm2 === 1) return 'Confirm (2)';
    else if (customer.deliver1 === 1) return 'Not Confirm (2)';
    else if (customer.confirm1 === 1) return 'Confirm (1)';
    else return 'Not Confirm (1)';
  };

  const delivery = (customer) => {
    if (customer.deliver1 === 0) return moment(customer.conditions_firstdeliverydate).format('DD/MM/YYYY') + " (1st)";
    else if (customer.deliver2 === 0) return moment(customer.conditions_seconddeliverydate).format('DD/MM/YYYY') + " (2nd)";
    else if (customer.deliver3 === 0) return moment(customer.conditions_thirddeliverydate).format('DD/MM/YYYY') + " (3rd)";
    else return "No Delivery";
  };

  const isUpcoming = (customer, numberOfDays) => {
    let nextDate = null;
    if (customer.deliver1 === 0) nextDate = new Date(customer.conditions_firstdeliverydate);
    else if (customer.deliver2 === 0) nextDate = new Date(customer.conditions_seconddeliverydate);
    else if (customer.deliver3 === 0) nextDate = new Date(customer.conditions_thirddeliverydate);
    if (nextDate) {
      const date = new Date();
      date.setDate(date.getDate() + numberOfDays);
      return nextDate > date;
    }
    return false
  }

  const performSearch = (value) => {
    const filter = value.toUpperCase();

    const newResults = results.filter((el) => {
      if (String(el.nff).toUpperCase().indexOf(filter) > -1
        || (String(el.firstName) + ' ' + String(el.lastName)).toUpperCase().indexOf(filter) > -1
        || String(el.phoneNumber).toUpperCase().indexOf(filter) > -1
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

  const showNeedsAttention = () => {
    const newResults = results.filter((el) => {
      return isPending(el);
    });
    setFilteredResults(newResults);
  };

  const showAll = () => {
    setFilteredResults(results);
  }

  const showUpcomingDelivery = (numberOfDays) => {
    const newResults = results.filter((el) => {
      return isUpcoming(el, numberOfDays);
    });
    setFilteredResults(newResults);
  }

  const newOrder = () => {
    setOpenNewOrder(true);
  }

  const handleClose = () => {
    setOpenNewOrder(false);
  }

  const handleFilter = (event) => {
    setFilterValue(event.target.value);
  }

  let filters = [
    {
      label: 'Show All',
      value: 'all',
      action: showAll
    },
    {
      label: 'Modified Pending Orders',
      value: 'pending',
      action: showNeedsAttention
    },
    {
      label: 'Delivery in 7 days',
      value: 'upcoming',
      action: () => showUpcomingDelivery(7)
    }
  ];

  filters =
    filters.map((option) => (
      <MenuItem key={option.value} value={option.value} onClick={option.action}>
        {option.label}
      </MenuItem>
    ));

  return (
    <Page
      className={classes.root}
      title="Orders"
    >
      <OrderView open={openNewOrder} close={handleClose} getOrders={getOrders} user={context.credentials.user} updates={updates} />
      <Container maxWidth={false}>
        <Toolbar
          performSearch={performSearch}
          buttonProps={{ label: 'NEW ORDER', action: newOrder }}
          calendarView={calendarView}
          calendarButtonProps={{
            calendarLabel: 'CALENDAR VIEW',
            calendarAction: () => setCalendarView(true),
            listLabel: 'LIST VIEW',
            listAction: () => setCalendarView(false)
          }}
          rightComponent={
            <TextField
              label="Filter"
              margin="normal"
              onChange={handleFilter}
              value={filterValue}
              variant="outlined"
              style={{ float: 'right' }}
              select
            >
              {filters}
            </TextField>
          }
        />
        <Box mt={3}>
          <Results updates={updates} results={filteredResults} user={context.credentials.user} callback={getOrders} calendarView={calendarView} />
        </Box>
      </Container>
    </Page>
  );
};

export default CustomerListView;
