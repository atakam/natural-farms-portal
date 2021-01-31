import React, { useState, useContext, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  MenuItem,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Password from './Password';

import { registerStaff, updateStaff } from '../../functions/index';
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

const getProfile = async (id, setResults) => {
  const response = await fetch('/staff/' + id, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
  const body = await response.text();
  const result = JSON.parse(body);
  console.log("results", JSON.parse(body));
  const {
    username,
    email,
    name,
    role
  } = result[0];
  setResults({
    username,
    email,
    name,
    role,
    password: ''
  });
};

const StaffFormView = (props) => {
  const [errorMessage, setErrorMessage] = useState('');
  const classes = useStyles();
  const context = useContext(AppContext);
  const [user, setUser] = useState(null);
  // const navigate = useNavigate();
  const userid = props.id || context.credentials.user.id;

  useEffect(() => {
    props.isProfile && getProfile(userid, setUser);
  }, []);

  let roles = [
    {
      label: 'Administrator',
      value: 'admin'
    },
    {
      label: 'Sales Representative',
      value: 'none'
    },
    {
      label: 'Delivery Representative',
      value: 'delivery'
    },
    {
      label: 'Supplier',
      value: 'supplier'
    }
  ];
  roles = 
      roles.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ));

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
        Submit
      </Button>
    </Box>
  );

  const initialValues = props.isProfile && user ? user : {
    username: '',
    email: '',
    name: '',
    password: '',
    role: 'none'
  }

  return (
    <Page
      className={props.classes || classes.root}
      title="Staff"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth={'xl'}>
          <Formik
            enableReinitialize={props.isProfile}
            initialValues={initialValues}
            validationSchema={
              Yup.object().shape({
                username: Yup.string().max(255).required('Username is required'),
                name: Yup.string().max(255).required('Name is required'),
                email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                role: Yup.string().max(255).required('Role is required'),
                password: props.isProfile ? null : Yup.string().max(255).required('Password is required')
              })
            }
            onSubmit={(values) => {
              console.log(values);
              if (props.isProfile) {
                updateStaff({entries: values, id: userid}).then((response) => {
                  console.log("UPDATE:", response);
                  if (!response) {
                    alert("Successfully updated staff");
                  } else {
                    alert("Error while updating staff");
                  }
                  props.updateCallback && props.updateCallback();
                });
              } else {
                registerStaff(values, setErrorMessage)
                .then((response) => {
                  if (response && response.data && (response.data[0] || response.data.affectedRows === 1)) {
                    console.log(response.data[0]);
                    props.updateCallback && props.updateCallback();
                    props.cancel && props.cancel();
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
            }) => (
              <form onSubmit={handleSubmit}>
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
                  disabled={props.isProfile}
                />
                <span style={{ padding: '10px' }} />
                <TextField
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                  label="Full Name"
                  margin="normal"
                  name="name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
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
                <TextField
                  error={Boolean(touched.role && errors.role)}
                  helperText={touched.role && errors.role}
                  label="Role"
                  margin="normal"
                  name="role"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.role}
                  variant="outlined"
                  className="halfWidth"
                  select
                >
                  { roles }
                </TextField>
                <Password
                  touched={touched}
                  errors={errors}
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                />
                <Typography
                    color="error"
                    variant="body1"
                  >
                    { errorMessage }
                </Typography>
                {submitButton}
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default StaffFormView;