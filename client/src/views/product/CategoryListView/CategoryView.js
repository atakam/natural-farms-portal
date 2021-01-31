import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  TextField,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';

import { createCategory, updateCategory } from 'src/functions/index';

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

const getCategory = async (id, setResults) => {
  const response = await fetch('/categories/' + id, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
  const body = await response.text();
  const result = JSON.parse(body);
  console.log("results", JSON.parse(body));
  const {
    name_en,
    name_fr,
    slug
  } = result[0];
  setResults({
    name_en,
    name_fr,
    slug
  });
};

const Category = (props) => {
  const classes = useStyles();
  const [category, setCategory] = useState({
    name_en: '', name_fr: '', slug: ''
  });
  // const navigate = useNavigate();
  const categoryId = props.id;

  useEffect(() => {
    props.isUpdate && getCategory(categoryId, setCategory);
  }, []);

  const submitButton = (
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
        {props.isUpdate ? 'Update' : 'Submit'}
      </Button>
    </Box>
  );

  const initialValues = category;

  return (
    <Page
      className={props.classes || classes.root}
      title="Categories"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth={'xl'}>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={
              Yup.object().shape({
                name_en: Yup.string().max(255).required('English name is required'),
                name_fr: Yup.string().max(255).required('French name is required'),
                slug: Yup.string().max(255).required('French name is required')
              })
            }
            onSubmit={(values) => {
              console.log(values);
              if (props.isUpdate) {
                updateCategory({entries: values, id: categoryId}).then((response) => {
                  console.log("UPDATE:", response);
                  props.updateCallback && props.updateCallback();
                });
              } else {
                createCategory(values)
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
                  error={Boolean(touched.name_en && errors.name_en)}
                  helperText={touched.name_en && errors.name_en}
                  label="Name (English)"
                  margin="normal"
                  name="name_en"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name_en}
                  variant="outlined"
                  className="halfWidth"
                />
                <span style={{ padding: '10px' }} />
                <TextField
                  error={Boolean(touched.name_fr && errors.name_fr)}
                  helperText={touched.name_fr && errors.name_fr}
                  label="Name (French)"
                  margin="normal"
                  name="name_fr"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name_fr}
                  variant="outlined"
                  className="halfWidth"
                />
                <TextField
                  error={Boolean(touched.slug && errors.slug)}
                  helperText={touched.slug && errors.slug}
                  label="Slug (identifier)"
                  margin="normal"
                  name="slug"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.slug}
                  variant="outlined"
                  className="halfWidth"
                />
                {submitButton}
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default Category;