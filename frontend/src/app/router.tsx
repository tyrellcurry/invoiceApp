import { createBrowserRouter } from 'react-router';
import RootLayout from '@/app/root-layout';
import AuthCallbackRoute from '@/app/routes/auth-callback';
import HomeRoute from '@/app/routes/home';
import InvoiceDetailRoute from '@/app/routes/invoice-detail';
import NotFoundRoute from '@/app/routes/not-found';
import SessionGate from '@/app/session-gate';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: 'auth/callback', element: <AuthCallbackRoute /> },
      {
        element: <SessionGate />,
        children: [
          { index: true, element: <HomeRoute /> },
          { path: 'invoices/:id', element: <InvoiceDetailRoute /> },
          { path: '*', element: <NotFoundRoute /> },
        ],
      },
    ],
  },
]);
