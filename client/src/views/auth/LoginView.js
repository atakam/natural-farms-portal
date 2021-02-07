import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Checkbox,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';

import PersonIcon from '@material-ui/icons/Person';
import RegisterView from './RegisterView';
import Password from './Password';
import AppContext from "../../components/AppContext";

import { logout, signin, forgotPassword } from '../../functions/index';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const LoginView = ({doLogout}) => {
  const classes = useStyles();
  const [isLogin, setLogin] = useState(true);
  const [isForgotPassword, setForgotPassword] = useState(false);
  const [message, setLoginStatus] = useState('');
  const [isSuccess, setLoginStatusSuccess] = useState(false);

  const context = useContext(AppContext);
  const navigate = useNavigate();

  doLogout && logout();

  const signUp = () => {
    setLogin(false);
    setForgotPassword(false);
  };
  useEffect(() => {
    if (context.credentials.loggedIn) {
      navigate('/', { replace: true });
    }
  }, []);

  const initialValues = isForgotPassword ? {
    email: '',
    isStaff: false
  } : {
    email: '',
    password: '',
    isStaff: false
  }

  return isLogin ? (
    <Page
      className={classes.root}
      title={isForgotPassword ? "Forgot Password" : "Login"}
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={initialValues}
            validationSchema={Yup.object().shape({
              email: Yup.string().max(255).required('Email/Username is required'),
              password: !isForgotPassword && Yup.string().max(255).required('Password is required')
            })}
            onSubmit={(values) => {
              console.log(values);
              if (isForgotPassword) {
                forgotPassword(values)
                .then((response) => {
                  console.log(response);
                  if (response.data.message) {
                    setLoginStatus(response.data.message);
                    setLoginStatusSuccess(response.data.status);
                  }
                });
              } else {
                signin(values)
                .then((response) => {
                  console.log(response);
                  if (response.data.message) {
                    setLoginStatus(response.data.message);
                  } else if (response.data[0]) {
                    let user = response.data[0];
                    if (user.username) {
                      user.firstName = user.name;
                      user.lastName = '';
                      user.streetAddress = '';
                      user.city = '';
                      user.sector = '';
                      user.postalCode = '';
                      user.province = '';
                      user.phoneNumber = '';
                      user.weekAmount = 0;
                      user.role = user.role === 'admin' ? 1 : 2 ;
                      user.dateCreated = "01/27/2021";
                      user.nff = null;
                      user.sessionid = "";
                    }
                    context.setCredentials({
                      loggedIn: true,
                      user
                    });
                  }
                })
              }
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    xs={12}
                    md={3}
                  />
                  <Grid
                    item
                    xs={12}
                    md={6}
                  >
                    <Button
                      color="primary"
                      fullWidth
                      startIcon={<PersonIcon />}
                      onClick={signUp}
                      size="large"
                      variant="contained"
                    >
                      New Customer
                    </Button>
                  </Grid>
                </Grid>
                <Box
                  mt={3}
                  mb={1}
                >
                  <Typography
                    align="center"
                    color="textSecondary"
                    variant="h3"
                  >
                    or login with email address
                  </Typography>
                </Box>
                <Box
                  alignItems="center"
                  display="flex"
                  ml={-1}
                >
                  <Checkbox
                    checked={values.isStaff}
                    name="isStaff"
                    onChange={handleChange}
                  />
                  <Typography
                    color="textSecondary"
                    variant="body1"
                  >
                    Are you a login in as a staff?
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label={values.isStaff ? "Username / Email" : "Email Address"}
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type={values.isStaff ? "text" : "email"}
                  value={values.email}
                  variant="outlined"
                  InputProps={{
                    autoComplete: 'new-password',
                    form: {
                      autoComplete: 'off',
                    }
                  }}
                />
                {!isForgotPassword &&
                  <Password
                    touched={touched}
                    errors={errors}
                    values={values}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    fullWidth
                  />
                }
                <Typography
                    color={isSuccess ? "secondary" : "error"}
                    variant="body1"
                  >
                    { message }
                </Typography>
                <Box my={2}>
                  <Button
                    color="primary"
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    {isForgotPassword ? 'Request password' : 'Sign in now'}
                  </Button>
                  <Typography
                    color="textSecondary"
                    variant="body1"
                    style={{marginTop: '10px'}}
                  >
                    <Link
                      href="#"
                      onClick={isForgotPassword ? () => setForgotPassword(false) : () => setForgotPassword(true)}
                      variant="h5"
                    >
                      {isForgotPassword ? 'Back to login' : 'Forgot you password?'}
                    </Link>
                  </Typography>
                </Box>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  ) : <RegisterView setLogin={setLogin} />;
};

export default LoginView;