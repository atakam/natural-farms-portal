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
import ProductView from './ProductView';

const useStyles = makeStyles(({
  root: {}
}));

const CreateStaff = ({ className, title, subtitle, id, updateCallback, cancel, ...rest }) => {
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
            <ProductView
                classes={classes}
                updateCallback={updateCallback}
                cancel={cancel}
            />
          </CardContent>
      </Card>
    </Container>
  );
};

CreateStaff.propTypes = {
  className: PropTypes.string
};

export default CreateStaff;
