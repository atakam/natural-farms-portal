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
import CategoryView from './CategoryView';

const useStyles = makeStyles(({
  root: {}
}));

const Category = ({ className, title, subtitle, id, updateCallback, cancel, isUpdate, ...rest }) => {
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
            <CategoryView
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

Category.propTypes = {
  className: PropTypes.string
};

export default Category;
