import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  makeStyles,
  Container
} from '@material-ui/core';
import RegisterView from 'src/views/auth/RegisterView';

const useStyles = makeStyles(({
  root: {}
}));

const Profile = ({ className, title, subtitle, id, updateCallback, cancel, ...rest }) => {
  const classes = useStyles();

  return (
    <Container maxWidth="lg">
      <Card>
          <CardHeader
            subheader={subtitle}
            title={title}
          />
          <Divider />
          <CardContent>
            <RegisterView
              classes={classes}
              isProfile
              id={id}
              updateCallback={updateCallback}
              cancel={cancel}
            />
          </CardContent>
      </Card>
    </Container>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;
