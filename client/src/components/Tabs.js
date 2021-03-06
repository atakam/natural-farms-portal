import React, {useEffect} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function SimpleTabs({tabs, className, appBarColor, tabValue, setTabValue, displayText, isCustomer, ...rest}) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setTabValue && setTabValue(newValue);
    setValue(newValue);
  };

  useEffect(() => {
    tabValue && setValue(tabValue);
  }, [tabValue]);

  return (
    <div className={clsx(classes.root, className)}>
      <AppBar position="static" color={appBarColor}>
        {displayText}
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" {...rest}>
            {
                tabs.map((tab, index) => (
                    <Tab key={index} label={tab.label} {...a11yProps(index)} />
                ))
            }
        </Tabs>
      </AppBar>
      {
        tabs.map((tab, index) => (
            <TabPanel value={value} index={index} key={index} className='tabContent'>
                {!isCustomer && tab.actions}
                {tab.content}
            </TabPanel>
        ))
      }
    </div>
  );
}
