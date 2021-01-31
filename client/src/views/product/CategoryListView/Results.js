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
import { deleteCategory } from 'src/functions/index';
import Category from './Category';

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
  const [categoryName, setCategoryName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
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
    setCategoryDialogOpen(false);
    setCategoryName('');
  }

  const handleConfirmDelete = () => {
    setDialogOpen(false);
    setCategoryName('');
    deleteCategory({id: objectProp.id})
    .then(() => callback());
  }

  const removeCategory = () => {
    setAnchorEl(null);
    setDialogOpen(true);
    setCategoryName(objectProp.name);
  }
  const editCategory = () => {
    setAnchorEl(null);
    setCategoryDialogOpen(true);
    setCategoryName(objectProp.name);
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
        content={'Are you sure you want to delete '+categoryName+'?'}
        subcontent={'This action is irreversible!'}
      />
      <Dialog
        open={categoryDialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="draggable-dialog-title"
        fullWidth
        maxWidth={'lg'}
      >
        <Category
          title={categoryName}
          subtitle={"Modify category information"}
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
                  Name (English)
                </TableCell>
                <TableCell>
                  Name (French)
                </TableCell>
                <TableCell>
                  Slug (identifier)
                </TableCell>
                <TableCell>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.slice(page * limit, (page * limit) + limit).map((category) => (
                <TableRow
                  hover
                  key={category.id}
                >
                  <TableCell>
                    {category.name_en}
                  </TableCell>
                  <TableCell>
                    {category.name_fr}
                  </TableCell>
                  <TableCell>
                    {category.slug}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      onClick={(e) => handleClick(e, {
                        id: category.id,
                        name: category.name_en + ' / ' + category.name_fr,
                        slug: category.slug
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
                      <MenuItem onClick={editCategory}>
                        <ListItemIcon>
                          <EditIcon fontSize="small" />
                        </ListItemIcon>
                        Edit Category
                      </MenuItem>
                      <MenuItem onClick={removeCategory}>
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
