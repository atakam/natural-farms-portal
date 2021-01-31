import React, { useEffect, useContext } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles
} from '@material-ui/core';
import {
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  ShoppingBag as ShoppingBagIcon,
  User as UserIcon,
  Users as UsersIcon,
  Mail as MailIcon,
  Tag as TagIcon
} from 'react-feather';
import NavItem from './NavItem';
import AppContext from "../../../components/AppContext";

const items = [
  {
    href: '/app/dashboard',
    icon: BarChartIcon,
    title: 'Dashboard',
    role: [1]
  },
  {
    href: '/app/allorders',
    icon: ShoppingBagIcon,
    title: 'All Orders',
    role: [1,2,3]
  },
  {
    href: '/app/orders',
    icon: ShoppingBagIcon,
    title: 'My Orders',
    role: [1,2,3]
  },
  {
    href: '/app/products',
    icon: TagIcon,
    title: 'Products',
    role: [1,2,3]
  },
  {
    href: '/app/customers',
    icon: UsersIcon,
    title: 'Customers',
    role: [1,2,3]
  },
  {
    href: '/app/staff',
    icon: UserIcon,
    title: 'Staff',
    role: [1,2,3]
  },
  {
    href: '/app/emailtemplates',
    icon: MailIcon,
    title: 'Email Templates',
    role: [1,2,3]
  },
  {
    href: '/app/account',
    icon: UserIcon,
    title: 'Account',
    role: [1]
  },
  {
    href: '/app/settings',
    icon: SettingsIcon,
    title: 'Settings',
    role: [1,2,3]
  }
];

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();
  const context = useContext(AppContext);

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const content = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        p={2}
      >
        <Typography
          className={classes.name}
          color="textPrimary"
          variant="h5"
        >
          {context.credentials.user.firstName + ' ' + context.credentials.user.lastName}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
        >
          {'NFF: ' + context.credentials.user.nff || '####'}
        </Typography>
      </Box>
      <Divider />
      <Box p={2}>
        <List>
          {items.map((item) => {
            if (item.role.includes(context.credentials.user.role)) {
              return (
                <NavItem
                  href={item.href}
                  key={item.title}
                  title={item.title}
                  icon={item.icon}
                />
              )
            }
          })}
        </List>
      </Box>
      <Box flexGrow={1} />
      <Box
        p={2}
        m={2}
        bgcolor="background.dark"
      >
        <Typography
          align="center"
          gutterBottom
          variant="h4"
        >
          Need more?
        </Typography>
        <Typography
          align="center"
          variant="body2"
        >
          Upgrade to PRO version and access 20 more screens
        </Typography>
        <Box
          display="flex"
          justifyContent="center"
          mt={2}
        >
          <Button
            color="primary"
            component="a"
            href="https://react-material-kit.devias.io"
            variant="contained"
          >
            See PRO version
          </Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default NavBar;
