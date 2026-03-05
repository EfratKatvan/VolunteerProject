import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LayoutNeedy from '../layouts/LayoutNeedy';
import LayoutVolunteer from '../layouts/LayoutVolunteer';
import HomeNeedy from '../pages/HomePages/HomeNeedy';
import HomeVolunteer from '../pages/HomePages/HomeVolunteer';
import LoginPage from '../pages/LoginPage';
import {RegisterPage} from '../pages/RegisterPage';
import AuthGuard from '../auth/AuthGuard';
import LoginGuard from '../auth/LoginGuard';
import { Paths } from './paths';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginGuard><LoginPage /></LoginGuard>,
  },
  {
    path: Paths.register,
    element: <LoginGuard><RegisterPage /></LoginGuard>,
  },
  {
    path: Paths.homeNeedy,
    element: (
      <AuthGuard role="needy">
        <LayoutNeedy />
      </AuthGuard>
    ),
    children: [
      { path: '', element: <HomeNeedy /> },
      // פה אפשר להוסיף עוד עמודים של Needy
    ],
  },
  {
    path: Paths.homeVolunteer,
    element: (
      <AuthGuard role="volunteer">
        <LayoutVolunteer />
      </AuthGuard>
    ),
    children: [
      { path: '', element: <HomeVolunteer /> },
      // פה אפשר להוסיף עוד עמודים של Volunteer
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}