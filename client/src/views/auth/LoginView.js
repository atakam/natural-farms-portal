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
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';

import PersonIcon from '@material-ui/icons/Person';
import RegisterView from './RegisterView';
import Password from './Password';
import AppContext from "../../components/AppContext";

import { logout, signin } from '../../functions/index';

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
  const [message, setLoginStatus] = useState('');

  const context = useContext(AppContext);
  const navigate = useNavigate();

  doLogout && logout();

  const signUp = () => {
    setLogin(false);
  };
  useEffect(() => {
    if (context.credentials.loggedIn) {
      navigate('/', { replace: true });
    }
  }, []);

  return isLogin ? (
    <Page
      className={classes.root}
      title="Login"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: '',
              password: '',
              isStaff: false
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string().max(255).required('Email/Username is required'),
              password: Yup.string().max(255).required('Password is required')
            })}
            onSubmit={(values) => {
              console.log(values);
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
              //navigate('/app/dashboard', { replace: true });
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
                <Password
                  touched={touched}
                  errors={errors}
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  fullWidth
                />
                <Typography
                    color="error"
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
                    Sign in now
                  </Button>
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