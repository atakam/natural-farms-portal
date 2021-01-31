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

const Product = ({ className, title, subtitle, id, updateCallback, cancel, isUpdate, ...rest }) => {
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
              id={id}
              updateCallback={updateCallback}
              cancel={cancel}
              isUpdate={isUpdate}
            />
          </CardContent>
      </Card>
    </Container>
  );
};

Product.propTypes = {
  className: PropTypes.string
};

export default Product;
