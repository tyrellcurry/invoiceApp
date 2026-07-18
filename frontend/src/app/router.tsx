import { createBrowserRouter } from 'react-router';
import RootLayout from '@/app/root-layout';
import HomeRoute from '@/app/routes/home';
import InvoiceDetailRoute from '@/app/routes/invoice-detail';
import NotFoundRoute from '@/app/routes/not-found';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <HomeRoute /> },
      { path: 'invoices/:id', element: <InvoiceDetailRoute /> },
      { path: '*', element: <NotFoundRoute /> },
    ],
  },
]);
