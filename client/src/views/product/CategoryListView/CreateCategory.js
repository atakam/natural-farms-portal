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

const CreateCategory = ({ className, title, subtitle, id, updateCallback, cancel, ...rest }) => {
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
                updateCallback={updateCallback}
                cancel={cancel}
            />
          </CardContent>
      </Card>
    </Container>
  );
};

CreateCategory.propTypes = {
  className: PropTypes.string
};

export default CreateCategory;
