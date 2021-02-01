import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  makeStyles
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CalendarIcon from '@material-ui/icons/Event';
import ListIcon from '@material-ui/icons/List';
import { Search as SearchIcon } from 'react-feather';

const useStyles = makeStyles((theme) => ({
  root: {},
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  }
}));

const Toolbar = ({ className, performSearch, buttonProps, calendarButtonProps, calendarView, ...rest }) => {
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState('');
  const handleChange = (event) => {
    setSearchValue(event.target.value);
  };
  let typingTimer;
  const doneTypingInterval = 1500;

  const calendarButton = calendarButtonProps && !calendarView ? (
    <Box
      display="flex"
      justifyContent="flex-end"
    >
      <Button
        color="primary"
        variant="contained"
        onClick={calendarButtonProps.calendarAction}
        startIcon={<CalendarIcon />}
      >
        {calendarButtonProps.calendarLabel}
      </Button>
    </Box>
  ) : (
    <Box
      display="flex"
      justifyContent="flex-end"
    >
      <Button
        color="primary"
        variant="contained"
        onClick={calendarButtonProps.listAction}
        startIcon={<ListIcon />}
      >
        {calendarButtonProps.listLabel}
      </Button>
    </Box>
  );

  const button = buttonProps ? (
      <Box
        display="flex"
        justifyContent="flex-end"
      >
        <Button
          color="primary"
          variant="contained"
          onClick={buttonProps.action}
          startIcon={<AddIcon />}
        >
          {buttonProps.label}
        </Button>
      </Box>
    ) : '';

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box
        display="flex"
        justifyContent="flex-end"
        p={2}
      >
        {calendarButton}
        <span style={{padding: '0 10px'}} />
        {button}
      </Box>
      <Box mt={3}>
        <Card>
          <CardContent>
            <Box maxWidth={500}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon
                        fontSize="small"
                        color="action"
                      >
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  ),
                  onKeyUp: (event) => {
                    clearTimeout(typingTimer);
                    const value = event.target.value;
                    typingTimer = setTimeout(() => performSearch(value), doneTypingInterval);
                  },
                  onKeyDown: () => clearTimeout(typingTimer)
                }}
                value={searchValue}
                onChange={handleChange}
                placeholder="Search"
                variant="outlined"
                disabled={!performSearch}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;
