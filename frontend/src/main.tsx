import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import 'regenerator-runtime/runtime';
// @deno-types="@types/react-dom/client"
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import '../style.css';
import './config/dayjs.config.ts';

// Pages
import { UserContextProvider } from './contexts/AuthContext.tsx';
import HomePage from './pages/HomePage.tsx';
import IndexPage from './pages/IndexPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import ProjectCreationPage from './pages/ProjectCreationPage.tsx';
import ProjectInputDataPage from './pages/ProjectInputDataPage.tsx';
import ProjectPage from './pages/ProjectPage.tsx';
import SignupPage from './pages/SignupPage.tsx';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <IndexPage />,
  },
  {
    path: '/home',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: 'project-creation',
    element: <ProjectCreationPage />,
  },
  {
    path: '/project/:projectId',
    element: <ProjectPage />,
  },
  {
    path: '/project/:projectId/insert-data',
    element: <ProjectInputDataPage />,
  },
]);

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <RouterProvider router={router} />
      </UserContextProvider>
    </QueryClientProvider>
  </StrictMode>
);
