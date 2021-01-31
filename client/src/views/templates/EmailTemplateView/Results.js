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
import EmailTemplate from './EmailTemplate';

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
    setProfileName('');
  }

  const editTemplate = () => {
    setAnchorEl(null);
    setDialogOpen(true);
    setProfileName(objectProp.name);
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
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="draggable-dialog-title"
        fullWidth
        maxWidth={'lg'}
      >
        <EmailTemplate
          title={profileName}
          subtitle={"Modify email template"}
          id={objectProp.id}
          updateCallback={updateCallback}
          cancel={handleCloseDialog}
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
                  Subject (English)
                </TableCell>
                <TableCell>
                  Subject (French)
                </TableCell>
                <TableCell>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.slice(0, limit).map((template) => (
                <TableRow
                  hover
                  key={template.id}
                >
                  <TableCell>
                    {template.name}
                  </TableCell>
                  <TableCell>
                    {template.subject_en}
                  </TableCell>
                  <TableCell>
                    {template.subject_fr}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      onClick={(e) => handleClick(e, {
                        id: template.id,
                        name: template.name,
                        subject_en: template.subject_en,
                        subject_fr: template.subject_fr,
                        content_en: template.content_en,
                        content_fr: template.content_fr
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
                      <MenuItem onClick={editTemplate}>
                        <ListItemIcon>
                          <EditIcon fontSize="small" />
                        </ListItemIcon>
                        Edit Template
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
  callback: PropTypes.func
};

export default Results;
