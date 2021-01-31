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

const Toolbar = ({ className, filter, buttonProps, ...rest }) => {
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState('');
  const handleChange = (event) => {
    setSearchValue(event.target.value);
    setTimeout(function(){ filter(searchValue); }, 1000);
  };

  const button = buttonProps ? (
      <Box
        display="flex"
        justifyContent="flex-end"
      >
        <Button
          color="primary"
          variant="contained"
          onClick={buttonProps.action}
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
      {button}
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
                  )
                }}
                value={searchValue}
                onChange={handleChange}
                placeholder="Search"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string,
  filter: PropTypes.func
};

export default Toolbar;
