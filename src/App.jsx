import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Form from './views/phamacore/form';
import Card from './views/components/Card';
import Summary from './views/phamacore/summary';
import Terms from './views/phamacore/terms';
import Login from './views/auth/login';
import Reset from './views/reset/reset';
import ResetLink from './views/reset/resetlink';
import SignIn from './views/auth/signin';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Card />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: 'signin',
    element: <SignIn />,
  },
  {
    path: 'resetlink',
    element: <ResetLink />,
  },
  {
    path: 'reset',
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
