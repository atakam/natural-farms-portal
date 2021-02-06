import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  CardHeader,
  Divider,
  CardContent,
  IconButton,
  Tooltip
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Delivery from './Delivery';

const CustomerListView = ({
    title,
    subtitle,
    id,
    updateCallback,
    cancel,
    original,
    isCustomer
}) => {
  const [results, setResults] = useState([]);

  const getOrders = async () => {
    const response = await fetch('/orders/original/' + id, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const body = await response.text();
    const result = JSON.parse(body);
    console.log("results", JSON.parse(body));
    setResults(result);
  };

  const getUpdatedOrders = async () => {
    const response = await fetch('/orders/updated/' + id, {
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
    original ? getOrders() : getUpdatedOrders();
  }, [original]);

  return (
    <Container maxWidth="lg">
      <Card>
            <CardHeader
                subheader={subtitle}
                title={title}
                action={
                    <Tooltip title="Close">
                        <IconButton
                            color="primary"
                            size="medium"
                            variant="contained"
                            onClick={cancel}
                        >
                            <CloseIcon /> 
                        </IconButton>
                    </Tooltip>
                }
            />
            <Divider />
            <CardContent>
                <Delivery results={results} callback={updateCallback} isCustomer />
            </CardContent>
      </Card>
    </Container>
  );
};

export default CustomerListView;
