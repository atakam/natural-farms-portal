import React, { useState, useContext, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormHelperText,
  Link,
  MenuItem,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Password from './Password';

import { register, updateUser, updateStaff } from '../../functions/index';
import AppContext from '../../components/AppContext';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  alert: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  }
}));

const getProfile = async (id, setResults, isStaffInProfile) => {
  const path = isStaffInProfile ? '/staff/' : '/user/';
  const response = await fetch(path + id, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
  const body = await response.text();
  const result = JSON.parse(body);
  console.log("results", JSON.parse(body));

  if (result[0]) {
    if (isStaffInProfile) {
      const {
        name,
        email,
        role,
        username
      } = result[0];
      setResults({
        email,
        name,
        role,
        password: '',
        username
      });
  
    } else {
      const {
        email,
        firstName,
        lastName,
        streetAddress,
        homePhone,
        sector,
        city,
        postalCode,
        province,
        phoneNumber,
        nff,
        weekAmount
      } = result[0];
      setResults({
        email,
        firstName,
        lastName,
        password: '',
        streetAddress,
        homePhone,
        sector,
        city,
        postalCode,
        province,
        phoneNumber,
        weekAmount,
        nff,
        policy: false
      });
    }
  }
};

const RegisterView = (props) => {
  const [errorMessage, setErrorMessage] = useState('');
  const classes = useStyles();
  const context = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [enableNFF, toggleNFF] = useState(false);
  // const navigate = useNavigate();
  const userid = props.id || (context.credentials.user && context.credentials.user.id);
  const userRole = context.credentials.user && context.credentials.user.role;
  const isStaffInProfile = props.isProfile && !props.isUserProfile && context.credentials.user && (userRole === 1 || userRole === 2);

  useEffect(() => {
    props.isProfile && getProfile(userid, setUser, isStaffInProfile);
  }, []);

  let provinces = ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon Territory"];
  let amounts = ['0', '< 25$', '< 50$', '< 100$', '< 150$', '150$ +'];

  provinces = 
      provinces.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ));
  amounts = 
      amounts.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ));

  const registerTitle = props.isProfile ? '' : (
    <Box mb={3}>
      <Typography
        color="textPrimary"
        variant="h2"
      >
        Create new account
      </Typography>
      <Typography
        color="textSecondary"
        gutterBottom
        variant="body2"
      >
        Use your email to create new account
      </Typography>
    </Box>
  );

  const termsConditions = (values, handleChange) => props.isProfile ? '' : (
    <Box
      alignItems="center"
      display="flex"
      ml={-1}
    >
      <Checkbox
        checked={values.policy}
        name="policy"
        onChange={handleChange}
      />
      <Typography
        color="textSecondary"
        variant="body1"
      >
        I have read the
        {' '}
        <Link
          color="primary"
          component={RouterLink}
          to="#"
          underline="always"
          variant="h6"
        >
          Terms and Conditions
        </Link>
      </Typography>
    </Box>
  );

  const signinLink = props.isProfile ? '' : (
    <Typography
      color="textSecondary"
      variant="body1"
    >
      Have an account?
      {' '}
      <Link
        onClick={() => props.setLogin(true)}
        variant="h6"
      >
        Sign in
      </Link>
    </Typography>
  );

  const submitButton = props.isProfile ? (
    <Box
      display="flex"
      justifyContent="flex-end"
      p={2}
    >
      {props.cancel && (<Button
        variant="contained"
        onClick={props.cancel}
        style={{marginRight: '10px'}}
      >
        Cancel
      </Button>)}
      <Button
        color="primary"
        variant="contained"
        type="submit"
      >
        Update
      </Button>
    </Box>
  ) : (
    <Box my={2}>
      <Button
        color="primary"
        fullWidth
        size="large"
        type="submit"
        variant="contained"
      >
        Sign up now
      </Button>
    </Box>
  );

  const initialValues = props.isProfile && user ? user : (
    isStaffInProfile ? {
      email: '',
      name: '',
      password: '',
      username: ''
    } :
    {
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    streetAddress: '',
    homePhone: '',
    sector: '',
    city: '',
    postalCode: '',
    province: 'Quebec',
    phoneNumber: '',
    weekAmount: '',
    policy: false,
    nff: ''
  })

  const updateCredentials = (values) => {
    console.log(values);
    values.role = 3;
    values.id = context.credentials.user.id;
    if (values.username) {
      values.firstName = values.name;
      values.lastName = '';
      values.streetAddress = '';
      values.homePhone = '';
      values.sector = '';
      values.city = '';
      values.postalCode = '';
      values.province = '';
      values.phoneNumber = '';
      values.weekAmount = 0;
      values.role = values.role === 'admin' ? 1 : 2 ;
      values.dateCreated = "01/27/2021";
      values.nff = null;
      values.sessionid = "";
    }
    context.setCredentials({
      loggedIn: true,
      user: values
    });
  }

  return (
    <Page
      className={props.classes || classes.root}
      title={props.isProfile ? "Profile" : "Register"}
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth={props.isProfile ? 'xl' : "sm"}>
          <Formik
            enableReinitialize={props.isProfile}
            initialValues={initialValues}
            validationSchema={
              isStaffInProfile ?
              Yup.object().shape({
                email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                name: Yup.string().max(255).required('Full name is required'),
                username: Yup.string().max(255).required('Username is required'),
                password: props.isProfile ? null : Yup.string().max(255).required('Password is required')
              }) :
              Yup.object().shape({
                email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                firstName: Yup.string().max(255).required('First name is required'),
                lastName: Yup.string().max(255).required('Last name is required'),
                password: props.isProfile ? null : Yup.string().max(255).required('Password is required'),
                streetAddress: Yup.string().max(255).required('Street address is required'),
                city: Yup.string().max(255).required('City is required'),
                postalCode: Yup.string().max(255).required('Postal Code is required'),
                province: Yup.string().max(255).required('Proovince is required'),
                phoneNumber: Yup.string().max(255).required('Phone number is required'),
                weekAmount: Yup.string().max(255).required('Amount per week is required'),
                policy: props.isProfile ? null : Yup.boolean().oneOf([true], 'This field must be checked')
              })
            }
            onSubmit={(values) => {
              console.log(values);
              if (props.isProfile) {
                if (isStaffInProfile) {
                  updateStaff({entries: values, id: userid}).then((response) => {
                    console.log("UPDATE:", response);
                    alert('Successfully updated staff profile');
                    updateCredentials(values);
                    props.updateCallback && props.updateCallback();
                  });
                } else {
                  updateUser({entries: values, id: userid}).then((response) => {
                    console.log("UPDATE:", response);
                    alert('Successfully updated profile');
                    !props.isUserProfile && updateCredentials(values);
                    props.updateCallback && props.updateCallback();
                  });
                }
                
              } else {
                register(values, 3, setErrorMessage)
                .then((response) => {
                  if (response && response.data && response.data[0]) {
                    console.log(response.data[0]);
                    context.setCredentials({
                      loggedIn: true,
                      user: response.data[0]
                    });
                  }
                });
              }
              // navigate('/app/dashboard', { replace: true });
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              touched,
              values
            }) => ( isStaffInProfile ?
              <form onSubmit={handleSubmit}>
                <TextField
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                  label="Full name"
                  margin="normal"
                  name="name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  variant="outlined"
                  className="halfWidth"
                />
                <span style={{ padding: '10px' }} />
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                  label="Email Address"
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  value={values.email}
                  variant="outlined"
                  className="halfWidth"
                />
                <TextField
                  error={Boolean(touched.username && errors.username)}
                  helperText={touched.username && errors.username}
                  label="Username"
                  margin="normal"
                  name="username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.username}
                  variant="outlined"
                  className="halfWidth"
                  disabled
                />
                <span style={{ padding: '10px' }} />
                <Password
                  touched={touched}
                  errors={errors}
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                />
                {submitButton}
              </form>
              :
              <form onSubmit={handleSubmit}>
                {registerTitle}
                <TextField
                  error={Boolean(touched.firstName && errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                  label="First name"
                  margin="normal"
                  name="firstName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  variant="outlined"
                  className="halfWidth"
                />
                <span style={{ padding: '10px' }} />
                <TextField
                  error={Boolean(touched.lastName && errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  label="Last name"
                  margin="normal"
                  name="lastName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  variant="outlined"
                  className="halfWidth"
                />

                <TextField
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                  label="Email Address"
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  value={values.email}
                  variant="outlined"
                  className="halfWidth"
                />
                <span style={{ padding: '10px' }} />
                <Password
                  touched={touched}
                  errors={errors}
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                />

                <TextField
                  error={Boolean(touched.streetAddress && errors.streetAddress)}
                  helperText={touched.streetAddress && errors.streetAddress}
                  label="Street Address"
                  margin="normal"
                  name="streetAddress"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.streetAddress}
                  variant="outlined"
                  className="halfWidth"
                />
                <span style={{ padding: '10px' }} />
                <TextField
                  error={Boolean(touched.city && errors.city)}
                  helperText={touched.city && errors.city}
                  label="City"
                  margin="normal"
                  name="city"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.city}
                  variant="outlined"
                  className="halfWidth"
                />

                <TextField
                  error={Boolean(touched.sector && errors.sector)}
                  helperText={touched.sector && errors.sector}
                  label="Sector"
                  margin="normal"
                  name="sector"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.sector}
                  variant="outlined"
                  className="halfWidth"
                />
                <span style={{ padding: '10px' }} />

                <TextField
                  error={Boolean(touched.postalCode && errors.postalCode)}
                  helperText={touched.postalCode && errors.postalCode}
                  label="Postal Code"
                  margin="normal"
                  name="postalCode"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.postalCode}
                  variant="outlined"
                  className="halfWidth"
                />
                <TextField
                  error={Boolean(touched.province && errors.province)}
                  helperText={touched.province && errors.province}
                  label="Province"
                  margin="normal"
                  name="province"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.province}
                  variant="outlined"
                  className="halfWidth"
                  select
                >
                  { provinces }
                </TextField>
                <span style={{ padding: '10px' }} />

                <TextField
                  error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                  helperText={touched.phoneNumber && errors.phoneNumber}
                  label="Phone Number"
                  margin="normal"
                  name="phoneNumber"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.phoneNumber}
                  variant="outlined"
                  className="halfWidth"
                />
                <TextField
                  error={Boolean(touched.homePhone && errors.homePhone)}
                  helperText={touched.homePhone && errors.homePhone}
                  label="Home Phone Number"
                  margin="normal"
                  name="homePhone"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.homePhone}
                  variant="outlined"
                  className="halfWidth"
                />
                <span style={{ padding: '10px' }} />
                <TextField
                  error={Boolean(touched.weekAmount && errors.weekAmount)}
                  helperText={touched.weekAmount && errors.weekAmount}
                  label="Amount spent on meat per week"
                  margin="normal"
                  name="weekAmount"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.weekAmount}
                  variant="outlined"
                  className="halfWidth"
                  select
                >
                  { amounts }
                </TextField>
                <TextField
                  error={Boolean(touched.nff && errors.nff)}
                  helperText={touched.nff && errors.nff}
                  label="NFF"
                  margin="normal"
                  name="nff"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.nff}
                  variant="outlined"
                  className="halfWidth"
                  disabled={!enableNFF}
                />
                <Box
                  alignItems="center"
                  display="inline"
                  ml={3}
                >
                  <Checkbox
                    checked={enableNFF}
                    name="enableNFF"
                    onChange={() => {
                      toggleNFF(!enableNFF);
                    }}
                  />
                  <Typography
                    color="textSecondary"
                    variant="body1"
                    display="inline"
                  >
                    I know the NFF number
                  </Typography>
                </Box>
                <Typography
                    color="error"
                    variant="body1"
                  >
                    { errorMessage }
                </Typography>
                {termsConditions(values, handleChange)}
                {Boolean(touched.policy && errors.policy) && (
                  <FormHelperText error>
                    {errors.policy}
                  </FormHelperText>
                )}
                {submitButton}
                {signinLink}
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default RegisterView;