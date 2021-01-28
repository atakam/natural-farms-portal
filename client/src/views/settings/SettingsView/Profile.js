import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  makeStyles
} from '@material-ui/core';
import RegisterView from 'src/views/auth/RegisterView';

const useStyles = makeStyles(({
  root: {}
}));

const Password = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <Card>
        <CardHeader
          subheader="Modify account information"
          title="Profile"
        />
        <Divider />
        <CardContent>
          <RegisterView
            classes={classes}
            isProfile
          />
        </CardContent>
    </Card>
  );
};

Password.propTypes = {
  className: PropTypes.string
};

export default Password;
