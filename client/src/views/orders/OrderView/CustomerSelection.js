import React, {useState} from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import Toolbar from 'src/components/Toolbar';

const CustomerSelection = ({ className, customerDetails, setCustomerDetails, results, ...rest }) => {
    const [details, setDetails] = useState(customerDetails);
    const [filteredResults, setFilteredResults] = useState(results);

    const performSearch = (value) => {
        const filter = value.toUpperCase();
    
        const newResults = results.filter((el) => {
          if (String(el.nff).toUpperCase().indexOf(filter) > -1
            || (String(el.firstName) + ' ' + String(el.lastName)).toUpperCase().indexOf(filter) > -1
          ) return true;
          return false;
        });
        setFilteredResults(newResults);
    };

    const selectedUser = details.nff && (
        <Typography
            color="textSecondary"
            variant="h2"
            style={{float: 'right'}}
        >
            {details.nff + ': ' + details.name}
        </Typography>
    )

    return (
        <PerfectScrollbar style={{marginTop: '-80px'}}>
            <Box minWidth={1050}>
            <Toolbar performSearch={performSearch} rightComponent={selectedUser} />
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                        NFF 
                        </TableCell>
                        <TableCell>
                        Customer Name
                        </TableCell>
                        <TableCell>
                        Select
                        </TableCell>
                    </TableRow>
                </TableHead>
                    <TableBody>
                    {filteredResults.map((item, idx) => (
                        <TableRow
                        hover
                        key={idx}
                        >
                            <TableCell>
                                {item.nff}
                            </TableCell>
                            <TableCell>
                                {item.firstName + ' ' + item.lastName}
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    color='primary'
                                    onClick={()=>{
                                        const newDetails = {
                                            nff: item.nff,
                                            customer_id: item.id,
                                            name: item.firstName + ' ' + item.lastName,
                                            signature_address: item.city + ', ' + item.province,
                                            email: item.email,
                                            phoneNumber: item.phoneNumber
                                        }
                                        setDetails(newDetails);
                                        setCustomerDetails(newDetails);
                                    }}
                                    disabled={details.customer_id === item.id}
                                >
                                    Select
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </Box>
        </PerfectScrollbar>
  );
};

CustomerSelection.propTypes = {
  className: PropTypes.string
};

export default CustomerSelection;
