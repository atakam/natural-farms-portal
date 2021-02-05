import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Card,
  Dialog,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import EmailIcon from '@material-ui/icons/Email';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import AssignmentIcon from '@material-ui/icons/Assignment';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
import AppDialog from '../../../components/AppDialog';
import { deleteForm } from '../../../functions/index';
import Profile from 'src/components/Profile';
import SingleOrderView from '../SingleOrderView/index';
import CalendarView from './CalendarView';
import OrderView from '../OrderView';
import {setSalesRep} from 'src/functions';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, results, updates, user, callback, calendarView, ...rest }) => {
  const classes = useStyles();
  const [limit, setLimit] = useState(50);
  const [page, setPage] = useState(0);
  const [profileName, setProfileName] = useState('');
  const [original, setOriginal] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showSalesList, setShowSalesList] = useState({});
  const [salesList, setSalesList] = useState([]);
  const [objectProp, setObject] = React.useState({formid: '', rid: ''});
  const [openEditOrder, setOpenEditOrder] = React.useState(false);

  useEffect(() => {
    getSalesRep();
  }, [results]);

  const getSalesRep = async () => {
    const response = await fetch('/staff', {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const body = await response.text();
    const result = JSON.parse(body);
    console.log("results", JSON.parse(body));
    setSalesList(result);
  };

  const handleClick = (target, obj) => {
    setAnchorEl(target);
    setObject(obj);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
    setOpenEditOrder(false);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setProfileDialogOpen(false);
    setOrderDialogOpen(false);
    setProfileName('');
    setOriginal(false);
  }

  const handleConfirmDelete = () => {
    setDialogOpen(false);
    setProfileName('');
    setOriginal(false);
    deleteForm({formid: objectProp.formid})
    .then(() => callback());
  }

  const delivery = (customer) => {
    if (customer.deliver1 === 0) return moment(customer.conditions_firstdeliverydate).format('DD/MM/YYYY') + " (1st)";
    else if (customer.deliver2 === 0) return moment(customer.conditions_seconddeliverydate).format('DD/MM/YYYY') + " (2nd)";
    else if (customer.deliver3 === 0) return moment(customer.conditions_thirddeliverydate).format('DD/MM/YYYY') + " (3rd)";
    else return "No Delivery";
  };

  const status = (customer) => {
    let returnValue = {color: 'error', message: 'Not Confirm (1)'};
    if (customer.signature_consumer_name === '') {
      returnValue = {color: 'error', message: 'Customer Signature'};
    } else if (customer.signature_merchant_name === '') {
      returnValue = {color: 'error', message: 'Sales Signature'};
    } else if (customer.deliver3 === 1) returnValue = {color: 'error', message: 'Expired'};
    else if (customer.confirm3 === 1) returnValue = {color: 'textPrimary', message: 'Confirm (3)'};
    else if (customer.deliver2 === 1) returnValue = {color: 'error', message: 'Not Confirm (3)'};
    else if (customer.confirm2 === 1) returnValue = {color: 'textPrimary', message: 'Confirm (2)'};
    else if (customer.deliver1 === 1) returnValue = {color: 'error', message: 'Not Confirm (2)'};
    else if (customer.confirm1 === 1) returnValue = {color: 'textPrimary', message: 'Confirm (1)'};

    return returnValue;
  };

  const edited = (customer) => {
    if (updates.includes(customer.formid)) {
      if (customer.status === 1) return (
        <Chip
          color="primary"
          label='Approved'
          size="small"
        />
      );
      else return (
        <Chip
          color="secondary"
          label='Pending'
          size="small"
        />
      );
    }
    else return '-';
  };

  const openInNewTab = (url) => {
    var win = window.open(url, '_blank');
    win.focus();
  }

  const handleEditContract = () => {
    setAnchorEl(null);
    setOpenEditOrder(true);
  };
  const goToContract = () => {
    setAnchorEl(null);
    openInNewTab(`https://www.portal.naturalfarms.ca/order/contract.php?id=${objectProp.formid}&rid=${objectProp.rid}`);
  };
  const resendEmail = () => {
    setAnchorEl(null);
    openInNewTab(`https://www.portal.naturalfarms.ca/order/print.php?id=${objectProp.formid}&email=${objectProp.email}&phone=${objectProp.phoneNumber}&lang=fr&password=(your%20password)&name=${objectProp.name}`);
  };
  const deleteOrder = () => {
    setAnchorEl(null);
    setDialogOpen(true);
    setProfileName(objectProp.name);
  }
  const editProfile = () => {
    setAnchorEl(null);
    setProfileDialogOpen(true);
    setProfileName(objectProp.name);
  }
  const updateCallback = () => {
    handleCloseDialog();
    callback();
  }
  const viewOrders = (isOriginal) => {
    setAnchorEl(null);
    setOrderDialogOpen(true);
    setProfileName(objectProp.name);
    setOriginal(isOriginal);
  }

  const handleSalesList = (formId) => {
    setShowSalesList({
      form_id: formId
    })
  }

  const handleCloseList = () => {
    setShowSalesList({})
  }

  const salesListOpions = salesList.map((option) => (
    <MenuItem
      key={option.id}
      value={option.id}
      onClick={() => setSalesRep({
        form_id: showSalesList.form_id,
        representative_id: option.id,
        callback: () => {
          handleCloseList();
          callback();
        }
      })}
    >
      {option.name}
    </MenuItem>
  ));

  const menuItems = (
    <Menu
      id="simple-menu"
      anchorEl={anchorEl && document.getElementById(anchorEl.id)}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
      className={anchorEl && anchorEl.menuStyle}
    >
      {anchorEl && <MenuItem>
        <strong>{anchorEl.customerName}</strong>
      </MenuItem>}
      <MenuItem onClick={editProfile}>
        <ListItemIcon>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        Edit Profile
      </MenuItem>
      {!calendarView && <MenuItem onClick={() => handleEditContract()}>
        <ListItemIcon>
          <AssignmentLateIcon fontSize="small" />
        </ListItemIcon>
        Edit Order
      </MenuItem>}
      {objectProp.isEdited &&
        <MenuItem onClick={() => viewOrders(false)}>
          <ListItemIcon>
            <LocalMallIcon fontSize="small" />
          </ListItemIcon>
          View Current Order
        </MenuItem>
      }
      <MenuItem onClick={() => viewOrders(true)}>
        <ListItemIcon>
          <ShoppingCartIcon fontSize="small" />
        </ListItemIcon>
        {objectProp.isEdited ? 'View Original Order' : 'View Order'}
      </MenuItem>
      <MenuItem onClick={() => goToContract()}>
        <ListItemIcon>
          <AssignmentIcon fontSize="small" />
        </ListItemIcon>
        View Contract
      </MenuItem>
      {!calendarView && <MenuItem onClick={() => resendEmail()}>
        <ListItemIcon>
          <EmailIcon fontSize="small" />
        </ListItemIcon>
        Resend Contract Email
      </MenuItem>}
      {!calendarView && <MenuItem onClick={deleteOrder}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
        Delete
      </MenuItem>}
    </Menu>
  )

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <OrderView
        open={openEditOrder}
        close={handleClose}
        getOrders={callback}
        user={user}
        updates={updates}
        selectedForm={objectProp}
        isEdit
      />
      <AppDialog
        open={dialogOpen}
        handleClose={handleCloseDialog}
        handleConfirm={handleConfirmDelete}
        title='Confirm Delete'
        content={'Are you sure you want to delete this order from '+profileName+'?'}
        subcontent={'This action is irreversible!'}
      />
      <Dialog
        open={profileDialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="draggable-dialog-title"
        fullWidth
        maxWidth={'lg'}
      >
        <Profile
          title={profileName}
          subtitle={"Modify account information"}
          id={objectProp.id}
          updateCallback={updateCallback}
          cancel={handleCloseDialog}
          isUserProfile
        />
      </Dialog>
      <Dialog
        open={orderDialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="draggable-dialog-title"
        fullWidth
        maxWidth={'lg'}
      >
        <SingleOrderView
          title={profileName}
          subtitle={original ? "ORIGINAL ORDER" : "MODIFIED ORDER"}
          id={objectProp.formid}
          updateCallback={updateCallback}
          cancel={handleCloseDialog}
          original={original}
        />
      </Dialog>
      {!calendarView ? 
      (<span>
        <PerfectScrollbar>
          <Box minWidth={1050}>
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
                    Date
                  </TableCell>
                  <TableCell>
                    T. Points
                  </TableCell>
                  <TableCell>
                    T. Price
                  </TableCell>
                  <TableCell>
                    Delivery
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
                {results.slice(page * limit, (page * limit) + limit).map((customer) => (
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
                      {customer.edited_points > 0 ? customer.edited_points : customer.total_points}
                    </TableCell>
                    <TableCell>
                      $ {customer.edited_price > 0 ? customer.edited_price : customer.price}
                    </TableCell>
                    <TableCell>
                      {delivery(customer)}
                    </TableCell>
                    <TableCell>
                      {showSalesList.form_id === customer.formid ?
                      <>
                        <TextField
                          label="Sales Rep"
                          value={customer.representative_id}
                          variant="outlined"
                          select
                        >
                          { salesListOpions }
                        </TextField>
                        <IconButton
                          color="inherit"
                          style={{width: '20px', height: '20px'}}
                          onClick={() => {handleCloseList()}}
                        >
                          <CloseIcon style={{width: '15px', height: '15px'}} />
                        </IconButton>
                      </>:
                      <>
                        {customer.repName}
                        <IconButton
                          color="inherit"
                          style={{width: '20px', height: '20px'}}
                          onClick={() => {handleSalesList(customer.formid)}}
                        >
                          <EditIcon style={{width: '15px', height: '15px'}} />
                        </IconButton>
                      </>
                      }
                    </TableCell>
                    <TableCell>
                      {edited(customer)}
                    </TableCell>
                    <TableCell>
                      <Typography color={status(customer).color}>{status(customer).message}</Typography> 
                    </TableCell>
                    <TableCell>
                      <Button
                        id="actionListButton"
                        variant="contained"
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        onClick={(e) => handleClick(e.currentTarget, {
                          ...customer,
                          formid: customer.formid,
                          rid: customer.representative_id,
                          email: customer.email,
                          phoneNumber: customer.phoneNumber,
                          name: customer.firstName + ' ' + customer.lastName,
                          nff: customer.nff,
                          id: customer.uid,
                          isEdited: edited(customer) !== '-',
                          isEditAllowed: customer.signature_consumer_name !== '' && customer.signature_merchant_name !== ''
                        })}
                        color="primary"
                      >
                        Actions
                      </Button>
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
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </span>
      )
      :
      <CalendarView
        results={results}
        callback={callback}
        showDate={new Date()}
        handleClick={handleClick}
      /> }
      {menuItems}
    </Card> 
  );
};

Results.propTypes = {
  className: PropTypes.string,
  updates: PropTypes.array,
  results: PropTypes.array.isRequired,
  id: PropTypes.number,
  callback: PropTypes.func
};

export default Results;
