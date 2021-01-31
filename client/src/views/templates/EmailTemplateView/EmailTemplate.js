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
import EmailTemplateView from './EmailTemplateView';

const useStyles = makeStyles(({
  root: {}
}));

const EmailTemplate = ({ className, title, subtitle, id, updateCallback, cancel, ...rest }) => {
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
            <EmailTemplateView
              classes={classes}
              id={id}
              updateCallback={updateCallback}
              cancel={cancel}
            />
          </CardContent>
      </Card>
    </Container>
  );
};

EmailTemplate.propTypes = {
  className: PropTypes.string
};

export default EmailTemplate;
