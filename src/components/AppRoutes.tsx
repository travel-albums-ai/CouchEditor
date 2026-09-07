import AppLayout from '@/layout';
import { appRoutes } from '@/routes';
import type { ReactElement } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

export default function AppRoutes(): ReactElement {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          {appRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}
        </Route>
      </Routes>
    </HashRouter>
  )
}
