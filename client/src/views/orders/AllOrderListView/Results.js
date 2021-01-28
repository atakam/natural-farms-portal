import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Card,
  Checkbox,
  ListItemIcon,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  makeStyles
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import EmailIcon from '@material-ui/icons/Email';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import AssignmentIcon from '@material-ui/icons/Assignment';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, results, userid, ...rest }) => {
  const classes = useStyles();
  const [limit, setLimit] = useState(50);
  const [page, setPage] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [objectProp, setObject] = React.useState({formid: '', rid: ''});

  const handleClick = (event, obj) => {
    setAnchorEl(event.currentTarget);
    setObject(obj);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const delivery = (customer) => {
    if (customer.deliver1 === 0) return moment(customer.conditions_firstdeliverydate).format('DD/MM/YYYY') + " (1st)";
    else if (customer.deliver2 === 0) return moment(customer.conditions_seconddeliverydate).format('DD/MM/YYYY') + " (2nd)";
    else if (customer.deliver3 === 0) return moment(customer.conditions_thirddeliverydate).format('DD/MM/YYYY') + " (3rd)";
    else return "No Delivery";
  };

  const status = (customer) => {
    if ((customer.confirm3 === 1 && customer.deliver3 === 0)) return {color: 'textPrimary', message: 'Confirm (3)'};
    else if ((customer.confirm2 === 1 && customer.deliver2 === 0)) return {color: 'textPrimary', message: 'Confirm (2)'};
    else if ((customer.confirm1 === 1 && customer.deliver1 === 0)) return {color: 'textPrimary', message: 'Confirm (1)'};
    
    else if ((customer.confirm1 === 0 && customer.deliver1 === 0)) return {color: 'textSecondary', message: 'Not Confirm (1)'};
    else if ((customer.confirm1 === 1 && customer.deliver1 === 1) && 
    (customer.confirm2 === 0 && customer.deliver1 === 0)) return {color: 'textSecondary', message: 'Not Confirm (2)'};
    else if ((customer.confirm1 === 1 && customer.deliver1 === 1) && 
    (customer.confirm2 === 1 && customer.deliver1 === 1) &&
    (customer.confirm3 === 0 && customer.deliver1 === 0)) return {color: 'textSecondary', message: 'Not Confirm (3)'};

    else if ((customer.confirm1 === 1 && customer.deliver1 === 1) && 
    (customer.confirm2 === 1 && customer.deliver1 === 1) &&
    (customer.confirm3 === 1 && customer.deliver1 === 1)) return {color: 'error', message: 'Expired'};

    else return {color: 'error', message: 'Unkwon'};
  };

  const openInNewTab = (url) => {
    var win = window.open(url, '_blank');
    win.focus();
  }

  const goToEditContract = () => {
    setAnchorEl(null);
    openInNewTab(`https://www.portal.naturalfarms.ca/order/adminedit.php?id=${objectProp.formid}&rid=${objectProp.rid}`);
  };
  const goToContract = () => {
    setAnchorEl(null);
    openInNewTab(`https://www.portal.naturalfarms.ca/order/contract.php?id=${objectProp.formid}&rid=${objectProp.rid}`);
  };
  const resendEmail = () => {
    setAnchorEl(null);
    openInNewTab(`https://www.portal.naturalfarms.ca/order/print.php?id=${objectProp.formid}&email=${objectProp.email}&phone=${objectProp.phoneNumber}&lang=fr&password=(your%20password)&name=${objectProp.name}`);
  };
  const goToVerify = () => {
    setAnchorEl(null);
    openInNewTab(`https://www.portal.naturalfarms.ca/order/edit.php?id=${objectProp.formid}&edit=yes&uid=${objectProp.uid}`);
  };

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <PerfectScrollbar>
        <Box minWidth={1050}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  NFF
                </TableCell>
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Date
                </TableCell>
                <TableCell>
                  T. Points
                </TableCell>
                <TableCell>
                  T. Price
                </TableCell>
                <TableCell>
                  Next Delivery
                </TableCell>
                <TableCell>
                  Sales Rep
                </TableCell>
                <TableCell>
                  Modified
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
                <TableCell>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.slice(0, limit).map((customer) => (
                <TableRow
                  hover
                  key={customer.formid}
                >
                  <TableCell>
                    {customer.nff}
                  </TableCell>
                  <TableCell>
                    {customer.firstName + ' ' + customer.lastName}
                    <br/>
                    {customer.phoneNumber}
                  </TableCell>
                  <TableCell>
                    <Box
                      alignItems="center"
                      display="flex"
                    >
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {moment(customer.signature_date).format('DD/MM/YYYY')}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {customer.total_points}
                  </TableCell>
                  <TableCell>
                    {customer.price}
                  </TableCell>
                  <TableCell>
                    {delivery(customer)}
                  </TableCell>
                  <TableCell>
                    {customer.repName}
                  </TableCell>
                  <TableCell>
                    {'-'}
                  </TableCell>
                  <TableCell>
                    <Typography color={status(customer).color}>{status(customer).message}</Typography> 
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      onClick={(e) => handleClick(e, {
                        formid: customer.formid,
                        rid: customer.representative_id,
                        email: customer.email,
                        phoneNumber: customer.phoneNumber,
                        name: customer.firstName + ' ' + customer.lastName
                      })}
                      color="secondary"
                    >
                      Action List
                    </Button>
                    <Menu
                      id="simple-menu"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                          <EditIcon fontSize="small" />
                        </ListItemIcon>
                        Edit Profile
                      </MenuItem>
                      <MenuItem onClick={() => goToEditContract()}>
                        <ListItemIcon>
                          <AssignmentLateIcon fontSize="small" />
                        </ListItemIcon>
                        Edit Contract
                      </MenuItem>
                      <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                          <LocalMallIcon fontSize="small" />
                        </ListItemIcon>
                        View Current Order
                      </MenuItem>
                      <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                          <ShoppingCartIcon fontSize="small" />
                        </ListItemIcon>
                        View Original Order
                      </MenuItem>
                      <MenuItem onClick={() => goToContract()}>
                        <ListItemIcon>
                          <AssignmentIcon fontSize="small" />
                        </ListItemIcon>
                        View Contract
                      </MenuItem>
                      <MenuItem onClick={() => resendEmail()}>
                        <ListItemIcon>
                          <EmailIcon fontSize="small" />
                        </ListItemIcon>
                        Resend Contract Email
                      </MenuItem>
                      <MenuItem onClick={() => goToVerify()}>
                        <ListItemIcon>
                          <VerifiedUserIcon fontSize="small" />
                        </ListItemIcon>
                        Verify Changes
                      </MenuItem>
                      <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                          <DeleteIcon fontSize="small" />
                        </ListItemIcon>
                        Delete
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={results.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  results: PropTypes.array.isRequired,
  id: PropTypes.number
};

export default Results;
