import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import MyOrderListView from 'src/views/orders/MyOrderListView';
import LoginView from 'src/views/auth/LoginView';
import NotFoundView from 'src/views/errors/NotFoundView';
import RegisterView from 'src/views/auth/RegisterView';
import SettingsView from 'src/views/settings/SettingsView';
import PDF from 'src/views/orders/ContractView/PDF';

const url = new URL(window.location);
const formid = url.searchParams.get("formid");

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'orders', element: <MyOrderListView /> },
      { path: 'settings', element: <SettingsView /> },
      { path: 'logout', element: <LoginView doLogout /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: 'contract',
    element: <PDF formid={formid}/>
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <LoginView /> },
      { path: 'register', element: <RegisterView /> },
      { path: '404', element: <NotFoundView /> },
      { path: '/', element: <Navigate to="/app/orders" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
