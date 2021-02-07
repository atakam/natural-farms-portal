import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  makeStyles,
  Tooltip,
  Container
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import RegisterView from 'src/views/auth/RegisterView';
import StaffFormView from 'src/views/auth/StaffFormView';

const useStyles = makeStyles(({
  root: {}
}));

const Profile = ({ className, title, subtitle, id, updateCallback, cancel, isStaff, isUserProfile, ...rest }) => {
  const classes = useStyles();

  return (
    <Container maxWidth="lg">
      <Card>
          <CardHeader
            subheader={subtitle}
            title={title}
            action={
              <Tooltip title="Close">
                  <IconButton
                      color="primary"
                      size="medium"
                      variant="contained"
                      onClick={cancel}
                  >
                      <CloseIcon /> 
                  </IconButton>
              </Tooltip>
            }
          />
          <Divider />
          <CardContent>
            {
              isStaff ? (
                <StaffFormView
                  classes={classes}
                  isProfile
                  id={id}
                  updateCallback={updateCallback}
                  cancel={cancel}
                />
              ) : (
                <RegisterView
                  classes={classes}
                  isProfile
                  isUserProfile={isUserProfile}
                  id={id}
                  updateCallback={updateCallback}
                  cancel={cancel}
                />
              )
            }
          </CardContent>
      </Card>
    </Container>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;
