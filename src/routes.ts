import SelectedPage_type from '@/pages/SelectedPage_type';
import SelectedPhotosPage_type_name from '@/pages/SelectedPhotosPage_type_name';
import { createElement, type ReactElement } from 'react';
import { matchPath, Navigate } from 'react-router-dom';
import routeDefinitions from './data/routes.json';

type RouteComponentKey =
  | 'SelectedPhotosPage_type_name'
  | 'SelectedPage_type'

type RouteMetadata = {
  title?: string
  icon?: string
  visible?: boolean
  includeInMenu?: boolean
  order?: number
}

export type RouteDetails = {
  path: string
  title?: string
  icon?: string
  visible: boolean
  includeInMenu: boolean
  order?: number
}

type RedirectRouteDefinition = {
  path: string
  type: 'redirect'
  to: string
  replace?: boolean
} & RouteMetadata

type PageRouteDefinition = {
  path: string
  type: 'page'
  component: RouteComponentKey
} & RouteMetadata

type RouteDefinition = RedirectRouteDefinition | PageRouteDefinition

export type AppRoute = {
  path: string
  element: ReactElement
}

export type MenuRoute = {
  path: string
  title: string
  icon?: string
  order?: number
}

const pageElements: Record<RouteComponentKey, () => ReactElement> = {
  SelectedPhotosPage_type_name: () => createElement(SelectedPhotosPage_type_name),
  SelectedPage_type: () => createElement(SelectedPage_type),
}

const normalizedRouteDefinitions: RouteDefinition[] = (routeDefinitions as RouteDefinition[]).map((routeDefinition) => ({
  ...routeDefinition,
  visible: routeDefinition.visible ?? true,
  includeInMenu: routeDefinition.includeInMenu ?? false,
}))

const pageRouteDetails: RouteDetails[] = normalizedRouteDefinitions
  .filter((routeDefinition): routeDefinition is PageRouteDefinition => routeDefinition.type === 'page')
  .map((routeDefinition) => ({
    path: routeDefinition.path,
    title: routeDefinition.title,
    icon: routeDefinition.icon,
    visible: routeDefinition.visible ?? true,
    includeInMenu: routeDefinition.includeInMenu ?? false,
    order: routeDefinition.order,
  }))

export function getRouteDetailsByPath(pathname: string): RouteDetails | undefined {
  const normalizedPathname = pathname || '/'

  return pageRouteDetails.find((routeDefinition) =>
    matchPath({ path: routeDefinition.path, end: true }, normalizedPathname),
  )
}

export const appRoutes: AppRoute[] = normalizedRouteDefinitions.map((routeDefinition) => {
  if (routeDefinition.visible === false) {
    return null
  }

  if (routeDefinition.type === 'redirect') {
    return {
      path: routeDefinition.path,
      element: createElement(Navigate, {
        to: routeDefinition.to,
        replace: routeDefinition.replace ?? false,
      }),
    }
  }

  return {
    path: routeDefinition.path,
    element: pageElements[routeDefinition.component](),
  }
}).filter((route): route is AppRoute => route !== null)

export const menuRoutes: MenuRoute[] = normalizedRouteDefinitions
  .filter((routeDefinition): routeDefinition is PageRouteDefinition => routeDefinition.type === 'page')
  .filter((routeDefinition) => routeDefinition.visible !== false)
  .filter((routeDefinition) => routeDefinition.includeInMenu === true)
  .filter((routeDefinition): routeDefinition is PageRouteDefinition & { title: string } => (
    typeof routeDefinition.title === 'string' && routeDefinition.title.length > 0
  ))
  .map((routeDefinition, index) => ({ routeDefinition, index }))
  .sort((a, b) => {
    const leftOrder = a.routeDefinition.order ?? Number.MAX_SAFE_INTEGER
    const rightOrder = b.routeDefinition.order ?? Number.MAX_SAFE_INTEGER

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder
    }

    return a.index - b.index
  })
  .map((routeDefinition) => ({
    path: routeDefinition.routeDefinition.path,
    title: routeDefinition.routeDefinition.title,
    icon: routeDefinition.routeDefinition.icon,
    order: routeDefinition.routeDefinition.order,
  }))
