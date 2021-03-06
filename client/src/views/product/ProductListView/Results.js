import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  Dialog,
  ListItemIcon,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  makeStyles
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AppDialog from 'src/components/AppDialog';
import { deleteProduct } from 'src/functions/index';
import Product from './Product';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, results, updates, userid, callback, ...rest }) => {
  const classes = useStyles();
  const [limit, setLimit] = useState(50);
  const [page, setPage] = useState(0);
  const [productName, setProductName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [objectProp, setObject] = React.useState({id: ''});

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

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setProfileDialogOpen(false);
    setProductName('');
  }

  const handleConfirmDelete = () => {
    setDialogOpen(false);
    setProductName('');
    deleteProduct({id: objectProp.id})
    .then(() => callback());
  }

  const removeProduct = () => {
    setAnchorEl(null);
    setDialogOpen(true);
    setProductName(objectProp.name);
  }
  const editProduct = () => {
    setAnchorEl(null);
    setProfileDialogOpen(true);
    setProductName(objectProp.name);
  }
  const updateCallback = () => {
    handleCloseDialog();
    callback();
  }

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <AppDialog
        open={dialogOpen}
        handleClose={handleCloseDialog}
        handleConfirm={handleConfirmDelete}
        title='Confirm Delete'
        content={'Are you sure you want to delete '+productName+'?'}
        subcontent={'This action is irreversible!'}
      />
      <Dialog
        open={profileDialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="draggable-dialog-title"
        fullWidth
        maxWidth={'lg'}
      >
        <Product
          title={productName}
          subtitle={"Modify product information"}
          id={objectProp.id}
          updateCallback={updateCallback}
          cancel={handleCloseDialog}
          isUpdate
        />
      </Dialog>
      <PerfectScrollbar>
        <Box minWidth={1050}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Category
                </TableCell>
                <TableCell>
                  Active
                </TableCell>
                <TableCell>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.slice(page * limit, (page * limit) + limit).map((product) => (
                <TableRow
                  hover
                  key={product.product_id}
                >
                  <TableCell>
                    {product.product_name_en + ' / ' + product.product_name_fr}
                  </TableCell>
                  <TableCell>
                    {product.category_name_en + ' / ' + product.category_name_fr}
                  </TableCell>
                  <TableCell>
                    {product.active === 1 ? 'Active' : <span style={{color: 'red'}}>Not Active</span>}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      onClick={(e) => handleClick(e, {
                        id: product.product_id,
                        name: product.product_name_en + ' / ' + product.product_name_fr,
                        category_name_en: product.category_name_en,
                        category_name_fr: product.category_name_fr,
                        active: product.active
                      })}
                      color="secondary"
                    >
                      Actions
                    </Button>
                    <Menu
                      id="simple-menu"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={editProduct}>
                        <ListItemIcon>
                          <EditIcon fontSize="small" />
                        </ListItemIcon>
                        Edit
                      </MenuItem>
                      <MenuItem onClick={removeProduct}>
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
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  results: PropTypes.array.isRequired,
  callback: PropTypes.func
};

export default Results;
