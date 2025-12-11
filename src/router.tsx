import { createHashRouter, RouterProvider, Outlet } from 'react-router';
import { ApiListPage } from './pages/ApiListPage';
import { HomePage } from './pages/HomePage';
import RootLayout from './layouts/RootLayout';


export const router = createHashRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/api-list',
        element: <ApiListPage />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
