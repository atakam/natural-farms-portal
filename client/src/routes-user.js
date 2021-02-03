import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import AccountView from 'src/views/account/AccountView';
import MyOrderListView from 'src/views/orders/MyOrderListView';
import AllOrderListView from 'src/views/orders/AllOrderListView';
import DashboardView from 'src/views/reports/DashboardView';
import LoginView from 'src/views/auth/LoginView';
import NotFoundView from 'src/views/errors/NotFoundView';
import ProductListView from 'src/views/product/ProductListView';
import RegisterView from 'src/views/auth/RegisterView';
import SettingsView from 'src/views/settings/SettingsView';
import CustomerListView from 'src/views/users/CustomerListView';
import StaffListView from 'src/views/users/StaffListView';
import EmailTemplateView from 'src/views/templates/EmailTemplateView';
import CategoryListView from 'src/views/product/CategoryListView';

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'orders', element: <MyOrderListView /> },
      { path: 'settings', element: <SettingsView /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
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
