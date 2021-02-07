import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  IconButton,
  Card,
  Checkbox,
  Dialog,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  makeStyles
} from '@material-ui/core';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import GetAppIcon from '@material-ui/icons/GetApp';
import EditIcon from '@material-ui/icons/Edit';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import OrderView from '../OrderView';
import SingleOrderView from '../SingleOrderView';
import ContractView from '../ContractView';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, results, updates, callback, user, ...rest }) => {
  const classes = useStyles();
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [openEditOrder, setOpenEditOrder] = React.useState(false);
  const [objectProp, setObject] = React.useState({});
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [contractDialogOpen, setContractDialogOpen] = useState(false);
  const [pdfView, setPdfView] = useState(false);
  const [pdfFormId, setPdfFormId] = useState(null);

  const handleSelectAll = (event) => {
    let newSelectedCustomerIds;

    if (event.target.checked) {
      newSelectedCustomerIds = results.map((customer) => customer.formid);
    } else {
      newSelectedCustomerIds = [];
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCustomerIds.indexOf(id);
    let newSelectedCustomerIds = [];

    if (selectedIndex === -1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds, id);
    } else if (selectedIndex === 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(1));
    } else if (selectedIndex === selectedCustomerIds.length - 1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds.slice(0, selectedIndex),
        selectedCustomerIds.slice(selectedIndex + 1)
      );
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
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

  const handleCloseDialog = () => {
    setOrderDialogOpen(false);
    setContractDialogOpen(false);
    setPdfView(false);
    setPdfFormId(null);
  }

  const viewOrder = (object) => {
    setOrderDialogOpen(true);
    setObject(object);
  };
  const viewContract = (object) => {
    setContractDialogOpen(true);
    setObject(object);
  };
  const downloadContract = ({formid}) => {
    setContractDialogOpen(true);
    setPdfView(true);
    setPdfFormId(formid)
  };
  const modify = (obj) => {
    setOpenEditOrder(true);
    setObject(obj);
  };
  const handleClose = () => {
    setOpenEditOrder(false);
  };

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Dialog
        open={orderDialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="draggable-dialog-title"
        fullWidth
        maxWidth={'lg'}
      >
        <SingleOrderView
          title={objectProp.name}
          subtitle={"ORDER DETAILS"}
          id={objectProp.formid}
          updateCallback={callback}
          cancel={handleCloseDialog}
          original={!objectProp.isEdited}
          isCustomer
        />
      </Dialog>
      <Dialog
        open={contractDialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="draggable-dialog-title"
        fullWidth
        maxWidth={'lg'}
      >
        <ContractView
          cancel={handleCloseDialog}
          objectProp={objectProp}
          showPDF={pdfView}
          pdfFormId={pdfFormId}
        />
      </Dialog>
      <OrderView
        open={openEditOrder}
        close={handleClose}
        getOrders={callback}
        user={user}
        updates={updates}
        selectedForm={objectProp}
        isEdit
      />
      <PerfectScrollbar>
        <Box minWidth={1050}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCustomerIds.length > 0 && selectedCustomerIds.length === results.length}
                    color="primary"
                    indeterminate={
                      selectedCustomerIds.length > 0
                      && selectedCustomerIds.length < results.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  Order Date
                </TableCell>
                <TableCell>
                  Points
                </TableCell>
                <TableCell>
                  Price
                </TableCell>
                <TableCell>
                  Next Delivery
                </TableCell>
                <TableCell>
                  Sales Rep
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
                  selected={selectedCustomerIds.indexOf(customer.formid) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCustomerIds.indexOf(customer.formid) !== -1}
                      onChange={(event) => handleSelectOne(event, customer.formid)}
                      value="true"
                    />
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
                    {customer.repName}
                  </TableCell>
                  <TableCell>
                    {
                    customer.status === 1 ?
                    <Typography color="textSecondary">Completed</Typography> :
                    (customer.signature_consumer_name === '' ? <Typography color="error">Signature Required</Typography> :
                    <Typography color="error">Pending</Typography>)
                    }
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View my Order">
                      <IconButton
                        color="primary"
                        size="medium"
                        variant="contained"
                        onClick={() => viewOrder({
                          formid: customer.formid,
                          name: customer.firstName + ' ' + customer.lastName,
                          isEdited: updates.includes(customer.formid)
                        })}
                      >
                        <ShoppingBasketIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View Contract">
                      <IconButton
                        color="primary"
                        size="medium"
                        variant="contained"
                        onClick={() => viewContract({
                          ...customer,
                          name: customer.firstName + ' ' + customer.lastName
                        })}
                      >
                        <InsertDriveFileIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download">
                      <IconButton
                        color="primary"
                        size="medium"
                        variant="contained"
                        onClick={() => downloadContract({formid: customer.formid})}
                      >
                        <GetAppIcon />
                      </IconButton>
                    </Tooltip>
                    {
                    (customer.status === 1 || (customer.status === 0 && customer.signature_consumer_name === '')) &&
                    <Tooltip title="Modify Order">
                      <IconButton
                        color="primary"
                        size="medium"
                        variant="contained"
                        onClick={() => modify({
                          ...customer,
                          formid: customer.formid,
                          rid: customer.representative_id,
                          email: customer.email,
                          phoneNumber: customer.phoneNumber,
                          name: customer.firstName + ' ' + customer.lastName,
                          nff: customer.nff,
                          id: customer.uid,
                          isEdited: updates.includes(customer.formid),
                          isEditAllowed: customer.signature_consumer_name !== '' && customer.signature_merchant_name !== ''
                        })}
                      >
                        <EditIcon /> 
                      </IconButton>
                    </Tooltip>}
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
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  results: PropTypes.array.isRequired
};

export default Results;
