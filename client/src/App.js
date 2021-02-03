import 'react-perfect-scrollbar/dist/css/styles.css';
import React, { useEffect, useState } from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';
import routes_user from 'src/routes-user';
import Axios from 'axios';
import LoginView from './views/auth/LoginView';
import 'src/resources/style.css';
import AppContext from './components/AppContext';

const App = () => {
  const routing = useRoutes(routes);
  const userrouting = useRoutes(routes_user);
  const [credentials, setCredentials] = useState(false);

  const userSettings = {
    credentials,
    setCredentials
  };

  Axios.defaults.withCredentials = true;
  useEffect(() => {
    Axios.get('/login').then((response) => {
      let user = null;
      if (response.data.loggedIn) {
        user = response.data.user[0];
        if (user.username) {
          user.firstName = user.name;
          user.lastName = '';
          user.streetAddress = '';
          user.city = '';
          user.postalCode = '';
          user.province = '';
          user.phoneNumber = '';
          user.weekAmount = 0;
          user.role = user.role === 'admin' ? 1 : 2 ;
          user.dateCreated = "01/27/2021";
          user.nff = null;
          user.sessionid = "";
        }
      }
      setCredentials({
        loggedIn: response.data.loggedIn,
        user
      });
    })
  }, []);

  return (
    <AppContext.Provider value={userSettings}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {credentials.loggedIn ? (credentials.user.role === 3 ? userrouting : routing ) : <LoginView />}
      </ThemeProvider>
    </AppContext.Provider>
  );
};

export default App;
