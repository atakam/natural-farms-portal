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
import { updateEmailTemplate } from 'src/functions';

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

const getTemplate = async (id, setResults) => {
  const response = await fetch('/templates/email/' + id, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
  const body = await response.text();
  const result = JSON.parse(body);
  console.log("results", JSON.parse(body));
  setResults(result[0]);
};

const EmailTemplateView = (props) => {
  const classes = useStyles();
  const [template, setTemplate] = useState({
    subject_en: '',
    subject_fr: '',
    content_en: '',
    content_fr: ''
  });
  // const navigate = useNavigate();
  const templateId = props.id;

  useEffect(() => {
    getTemplate(templateId, setTemplate);
  }, []);

  const initialValues = template;

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
            enableReinitialize
            initialValues={initialValues}
            validationSchema={
              Yup.object().shape({
                subject_en: Yup.string().max(255).required('English subject is required'),
                subject_fr: Yup.string().max(255).required('French subject is required'),
                content_en: Yup.string().max(50000).required('English content is required'),
                content_fr: Yup.string().max(50000).required('French content is required')
              })
            }
            onSubmit={(values) => {
              console.log(values);
              updateEmailTemplate({entries: values, id: templateId}).then((response) => {
                console.log("UPDATE:", response);
                props.updateCallback && props.updateCallback();
              });
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
                  error={Boolean(touched.subject_en && errors.subject_en)}
                  helperText={touched.subject_en && errors.subject_en}
                  label="Subject (English)"
                  margin="normal"
                  name="subject_en"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.subject_en}
                  variant="outlined"
                  fullWidth
                />
                <TextField
                  error={Boolean(touched.content_en && errors.content_en)}
                  helperText={touched.content_en && errors.content_en}
                  label="Content (English)"
                  margin="normal"
                  name="content_en"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.content_en}
                  variant="outlined"
                  fullWidth
                  multiline
                  rowsMax={16}
                />

                <TextField
                  error={Boolean(touched.subject_fr && errors.subject_fr)}
                  helperText={touched.subject_fr && errors.subject_fr}
                  label="Subject (French)"
                  margin="normal"
                  name="subject_fr"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.subject_fr}
                  variant="outlined"
                  fullWidth
                />
                
                <TextField
                  error={Boolean(touched.content_fr && errors.content_fr)}
                  helperText={touched.content_fr && errors.content_fr}
                  label="Content (French)"
                  margin="normal"
                  name="content_fr"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.content_fr}
                  variant="outlined"
                  fullWidth
                  multiline
                  rowsMax={16}
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
                    Update
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default EmailTemplateView;