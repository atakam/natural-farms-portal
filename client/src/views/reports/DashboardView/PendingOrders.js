import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  colors,
  makeStyles
} from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.orange[600],
    height: 56,
    width: 56
  },
  differenceIcon: {
    color: colors.green[900]
  },
  differenceValue: {
    color: colors.green[900],
    marginRight: theme.spacing(1)
  }
}));

const PendingOrders = ({ className, count, ...rest }) => {
  const classes = useStyles();

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
        <Grid
          container
          justify="space-between"
          spacing={3}
        >
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h6"
            >
              PENDING APPROVAL
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              {count}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <AccessTimeIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box
          mt={2}
          display="flex"
          alignItems="center"
        >
          <Typography
            color="textSecondary"
            variant="caption"
          >
            Modified orders awaiting approval
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

PendingOrders.propTypes = {
  className: PropTypes.string
};

export default PendingOrders;
