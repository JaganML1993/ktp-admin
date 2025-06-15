/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy } from 'react';
import { Outlet, createBrowserRouter } from 'react-router-dom';
import paths, { rootPaths } from './paths';
import MainLayout from 'layouts/main-layout';
import AuthLayout from 'layouts/auth-layout';
import Splash from 'components/loading/Splash';
import PageLoader from 'components/loading/PageLoader';
import ProtectedRoute from 'components/ProtectedRoute';

const App = lazy(() => import('App'));
const Dashboard = lazy(() => import('pages/dashboard'));
const Login = lazy(() => import('pages/authentication/Login'));
const Signup = lazy(() => import('pages/authentication/Signup'));
const Location = lazy(() => import('pages/location/location'));
const LocationCreate = lazy(() => import('pages/location/locationCreate'));
const LocationEdit = lazy(() => import('pages/location/locationEdit'));

const router = createBrowserRouter(
  [
    {
      element: (
        <Suspense fallback={<Splash />}>
          <App />
        </Suspense>
      ),
      children: [
        // Protected routes
        {
          element: <ProtectedRoute />, // <--- Wrap all protected routes
          children: [
            {
              path: '/',
              element: (
                <MainLayout>
                  <Suspense fallback={<PageLoader />}>
                    <Outlet />
                  </Suspense>
                </MainLayout>
              ),
              children: [
                { index: true, element: <Dashboard /> },
                { path: 'location', element: <Location /> },
                { path: 'pages/location/create', element: <LocationCreate /> },
                { path: 'pages/location/edit/:id', element: <LocationEdit /> },
              ],
            },
          ],
        },
        // Auth routes (not protected)
        {
          path: rootPaths.authRoot,
          element: (
            <AuthLayout>
              <Outlet />
            </AuthLayout>
          ),
          children: [
            { path: paths.login, element: <Login /> },
            { path: paths.signup, element: <Signup /> },
          ],
        },
      ],
    },
  ],
  {
    basename: '/jv-app',
  },
);

export default router;
