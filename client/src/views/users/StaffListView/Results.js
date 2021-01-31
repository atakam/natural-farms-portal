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
import { deleteStaff } from 'src/functions/index';
import Profile from 'src/components/Profile';

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
  const [profileName, setProfileName] = useState('');
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
    setProfileName('');
  }

  const handleConfirmDelete = () => {
    setDialogOpen(false);
    setProfileName('');
    deleteStaff({id: objectProp.id})
    .then(() => callback());
  }

  const removeUser = () => {
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

  const deleteEl = objectProp.role !== 'admin' ? (
    <MenuItem onClick={removeUser}>
      <ListItemIcon>
        <DeleteIcon fontSize="small" />
      </ListItemIcon>
      Delete
    </MenuItem>
  ) : '';

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
        content={'Are you sure you want to delete '+profileName+'?'}
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
          subtitle={"Modify staff information"}
          id={objectProp.id}
          updateCallback={updateCallback}
          cancel={handleCloseDialog}
          isStaff
        />
      </Dialog>
      <PerfectScrollbar>
        <Box minWidth={1050}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Username
                </TableCell>
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Email
                </TableCell>
                <TableCell>
                  Role
                </TableCell>
                <TableCell>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.slice(page * limit, (page * limit) + limit).map((staff) => (
                <TableRow
                  hover
                  key={staff.id}
                >
                  <TableCell>
                    {staff.username}
                  </TableCell>
                  <TableCell>
                    {staff.name}
                  </TableCell>
                  <TableCell>
                    {staff.email}
                  </TableCell>
                  <TableCell>
                    {staff.role === 'admin' ? 'Administrator' : (staff.role === 'supplier' ? 'Supplier' : (staff.role === 'delivery' ? 'Delivery' : 'Sales Representative'))}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      onClick={(e) => handleClick(e, {
                        id: staff.id,
                        name: staff.name,
                        email: staff.email,
                        role: staff.role
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
                      <MenuItem onClick={editProfile}>
                        <ListItemIcon>
                          <EditIcon fontSize="small" />
                        </ListItemIcon>
                        Edit Profile
                      </MenuItem>
                      {deleteEl}
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
