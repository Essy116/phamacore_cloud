import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Form from './views/phamacore/form';
import Packages from './views/phamacore/packages';
import Summary from './views/phamacore/summary';
import Terms from './views/phamacore/terms';
import Login from './views/auth/login';
import Reset from './views/reset/reset';
import ResetLink from './views/reset/resetlink';
import SignIn from './views/auth/signin';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Packages />,
  },
  {
    path: 'signin',
    element: <SignIn />,
  },
  {
    path: '/login',
    element: <Login />,
  },

  {
    path: 'resetlink',
    element: <ResetLink />,
  },
  {
    path: 'verify-email/:id',
    element: <Login />,
  },
  {
    path: 'reset-password/:token',
    element: <Reset />,
  },
  {
    path: 'form',
    element: <Form />,
  },
  {
    path: 'terms',
    element: <Terms />,
  },
  {
    path: 'summary',
    element: <Summary />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
