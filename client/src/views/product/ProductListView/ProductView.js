import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  TextField,
  MenuItem,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import { updateProduct, createProduct } from 'src/functions';
import Packaging from './Packaging';

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

const getProduct = async (id, setResults) => {
  const response = await fetch('/products/' + id, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
  const body = await response.text();
  const result = JSON.parse(body);
  console.log("results", JSON.parse(body));
  setResults(result[0]);
};

const getCategory = async (setResults) => {
  const response = await fetch('/categories/product', {
    headers: {
      'Content-Type': 'application/json',
    }
  });
  const body = await response.text();
  let result = JSON.parse(body);
  console.log("results", JSON.parse(body));
  result = result.map((cat) => {
    return {
      label: cat.name_en + ' / ' + cat.name_fr,
      value: cat.id
    };
  });
  setResults(result);
};

const getPackaging = async (productId, setResults) => {
  const response = await fetch('/packaging/product/' + productId, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
  const body = await response.text();
  let result = JSON.parse(body);
  console.log("packaging", JSON.parse(body));
  setResults(result);
};

const ProductView = (props) => {
  const classes = useStyles();
  const [categories, setCategories] = useState([{
    label: 'Beef',
    value: 1
  }]);
  const [packaging, setPackaging] = useState([]);
  const [product, setProduct] = useState({
    name_en: '',
    name_fr: '',
    category_id: '',
    image_name: '',
    active: 0
  });
  // const navigate = useNavigate();
  const productId = props.id;

  useEffect(() => {
    props.isUpdate && getProduct(productId, setProduct);
    getCategory(setCategories);
    props.isUpdate && getPackaging(productId, setPackaging);
  }, []);

  const initialValues = product;

  const categoryOptions = 
      categories.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ));
  
  const activeOptions = [(
    <MenuItem key={0} value={0}>
      Not Active
    </MenuItem>
  ), (
    <MenuItem key={1} value={1}>
      Active
    </MenuItem>
  )];

  return (
    <Page
      className={props.classes || classes.root}
      title="Products"
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
                category_id: Yup.string().max(255).required('Category is required'),
                active: Yup.string().max(255).required('Active is required')
              })
            }
            onSubmit={(values) => {
              console.log(values);
              if (props.isUpdate) {
                updateProduct({entries: values, id: productId}).then((response) => {
                  console.log("UPDATE:", response);
                  props.updateCallback && props.updateCallback();
                });
              } else {
                createProduct(values)
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
                  error={Boolean(touched.category_id && errors.category_id)}
                  helperText={touched.category_id && errors.category_id}
                  label="Category"
                  margin="normal"
                  name="category_id"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.category_id}
                  variant="outlined"
                  className="halfWidth"
                  select
                >
                    { categoryOptions }
                </TextField>
                <span style={{ padding: '10px' }} />
                <TextField
                  error={Boolean(touched.active && errors.active)}
                  helperText={touched.active && errors.active}
                  label="Active"
                  margin="normal"
                  name="active"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.active}
                  variant="outlined"
                  className="halfWidth"
                  select
                  >
                    { activeOptions }
                </TextField>

                <TextField
                  error={Boolean(touched.image_name && errors.image_name)}
                  helperText={touched.image_name && errors.image_name}
                  label="Product Image"
                  margin="normal"
                  name="image_name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.image_name}
                  variant="outlined"
                  className="halfWidth"
                />
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
              </form>
            )}
          </Formik>
          <Packaging results={packaging} />
        </Container>
      </Box>
    </Page>
  );
};

export default ProductView;