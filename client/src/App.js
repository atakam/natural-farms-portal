import 'react-perfect-scrollbar/dist/css/styles.css';
import React, { useEffect, useState } from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';
import Axios from 'axios';
import LoginView from './views/auth/LoginView';
import 'src/resources/style.css';
import AppContext from './components/AppContext';

const App = () => {
  const routing = useRoutes(routes);
  const [credentials, setCredentials] = useState(false);

  const userSettings = {
    credentials,
    setCredentials
  };

  Axios.defaults.withCredentials = true;
  useEffect(() => {
    Axios.get('/login').then((response) => {
      setCredentials({
        loggedIn: response.data.loggedIn,
        user: response.data.loggedIn ? response.data.user[0] : null
      });
    })
  }, []);

  return (
    <AppContext.Provider value={userSettings}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {credentials.loggedIn ? routing : <LoginView />}
      </ThemeProvider>
    </AppContext.Provider>
  );
};

export default App;
