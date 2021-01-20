import React, { Suspense, Fragment, lazy } from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import DocsLayout from 'src/layouts/DocsLayout';
import MainLayout from 'src/layouts/MainLayout';
import HomeView from 'src/views/home/HomeView';
import LoadingScreen from 'src/components/LoadingScreen';
import AuthGuard from 'src/components/AuthGuard';
import GuestGuard from 'src/components/GuestGuard';


export const renderRoutes = (routes = []) => (
  
  <Suspense fallback={<LoadingScreen />}>
    <Switch>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Component = route.component;

        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            render={props => (
              <Guard>
                <Layout>
                  {route.routes ? (
                    renderRoutes(route.routes)
                  ) : (
                    <Component {...props} />
                  )}
                </Layout>
              </Guard>
            )}
          />
        );
      })}
    </Switch>
  </Suspense>
);

const routes = [
  {
    exact: true,
    path: '/404',
    component: lazy(() => import('src/views/errors/NotFoundView'))
  },
  {
    exact: true,
    guard: GuestGuard,
    path: '/login',
    component: lazy(() => import('src/views/auth/LoginView'))
  },
  {
    exact: true,
    path: '/login-unprotected',
    component: lazy(() => import('src/views/auth/LoginView'))
  },
  {
    exact: true,
    guard: GuestGuard,
    path: '/register',
    component: lazy(() => import('src/views/auth/RegisterView'))
  },
  {
    exact: true,
    guard: GuestGuard,
    path: '/forgotPassword',
    component: lazy(() => import('src/views/auth/ForgotPasswordView'))
  },
  {
    exact: true,
    guard: GuestGuard,
    path: '/resetPassword/:token',
    component: lazy(() => import('src/views/auth/ResetPassword'))
  },
  {
    exact: true,
    path: '/register-unprotected',
    component: lazy(() => import('src/views/auth/RegisterView'))
  },
  
  {
    path: '/app',
    guard: AuthGuard,
    layout: DashboardLayout,
    routes: [
      {
        exact: true,
        path: '/app/account',
        component: lazy(() => import('src/views/account/AccountView'))
      },
      {
        exact: true,
        path: '/app/extra/GHighcharts/GlobalLinear',
        component: lazy(() => import('src/views/chartGlobals/linearHighchart'))
      },
      {
        exact: true,
        path: '/app/extra/QHighcharts/linear',
        component: lazy(() => import('src/views/chartQuest/linearHighchart'))
      },
      {
        exact: true,
        path: '/app/extra/GHighcharts/GlobalDaily',
        component: lazy(() => import('src/views/chartGlobals/dailyHighchart'))
      },
      {
        exact: true,
        path: '/app/extra/QHighcharts/daily',
        component: lazy(() => import('src/views/chartQuest/dailyHighchart'))
      },
      {
        exact: true,
        path: '/app/extra/GHighcharts/GlobalHours',
        component: lazy(() => import('src/views/chartGlobals/hoursHighchart'))
      },
      {
        exact: true,
        path: '/app/extra/QHighcharts/Hours',
        component: lazy(() => import('src/views/chartQuest/hoursHighchart'))
      },
      {
        exact: true,
        path: '/app/extra/GHighcharts/GlobalPyramid',
        component: lazy(() => import('src/views/chartGlobals/pyramidHighchart'))
      },
      {
        exact: true,
        path: '/app/extra/QHighcharts/Pyramid',
        component: lazy(() => import('src/views/chartQuest/pyramidHighchart'))
      },
      {
        exact: true,
        path: '/app/extra/QHighcharts/models',
        component: lazy(() => import('src/views/chartQuest/modelsHighchart'))
      },
      {
        exact: true,
        path: '/app/extra/QHighcharts/multiple',
        component: lazy(() => import('src/views/chartQuest/multiBarHighchart'))
      },
      {
        exact: true,
        path: '/app/management/omsleads',
        component: lazy(() => import('src/views/omsGlobal/OmsGlobalListView'))
      },
      {
        exact: true,
        path: '/app/management/questLeads',
        component: lazy(() => import('src/views/questLead/QuestLeadsListView'))
      },
      {
        exact: true,
        path: '/app/management/loadLeads',
        component: lazy(() => import('src/views/uploadCsv/DetailsView'))
      },
      {
        exact: true,
        path: '/app/management/makes',
        component: lazy(() => import('src/views/make/MakeListView'))
      },
      {
        exact: true,
        path: '/app/management/companies',
        component: lazy(() => import('src/views/company/CompanyListView'))
      },
      {
        exact: true,
        path: '/app/management/stores',
        component: lazy(() => import('src/views/store/StoreListView'))
      },
      {
        exact: true,
        path: '/app/management/sources',
        component: lazy(() => import('src/views/source/SourceListView'))
      },
      {
        exact: true,
        path: '/app/management/vehicles',
        component: lazy(() => import('src/views/vehicle/VehicleListView'))
      },
      {
        exact: true,
        path: '/app/management/status',
        component: lazy(() => import('src/views/status/StatusListView'))
      },
      {
        exact: true,
        path: '/app/management/users',
        component: lazy(() => import('src/views/user/UserListView'))
      },
      {
        exact: true,
        path: '/app/management/documents',
        component: lazy(() => import('src/views/document/DocumentListView'))
      },
      {
        exact: true,
        path: '/app/management/omsLeads/:id',
        component: lazy(() => import('src/views/omsGlobal/OmsGlobalDetailsView'))
      },
      {
        exact: true,
        path: '/app/management/companies/:id',
        component: lazy(() => import('src/views/company/CompanyDetailsView'))
      },
      {
        exact: true,
        path: '/app/management/questLeads/:id',
        component: lazy(() => import('src/views/questLead/QuestLeadsDetailsView'))
      },
      {
        exact: true,
        path: '/app/management/documents/:id',
        component: lazy(() => import('src/views/document/DocumentDetailsView'))
      },
      {
        exact: true,
        path: '/app/management/stores/:id',
        component: lazy(() => import('src/views/store/StoreDetailsView'))
      },
      {
        exact: true,
        path: '/app/management/makes/:id',
        component: lazy(() => import('src/views/make/MakeDetailsView'))
      },
      {
        exact: true,
        path: '/app/management/sources/:id',
        component: lazy(() => import('src/views/source/SourceDetailsView'))
      },
      {
        exact: true,
        path: '/app/management/vehicles/:id',
        component: lazy(() => import('src/views/vehicle/VehicleDetailsView'))
      }, 
      {
        exact: true,
        path: '/app/management/status/:id',
        component: lazy(() => import('src/views/status/StatusDetailsView'))
      },
      {
        exact: true,
        path: '/app/management/users/:id',
        component: lazy(() => import('src/views/user/UserDetailsView'))
      },
      
      {
        exact: true,
        path: '/app/management/companies/:id/edit',
        component: lazy(() => import('src/views/company/CompanyEditView'))
      },
      {
        exact: true,
        path: '/app/management/omsLeads/:id/edit',
        component: lazy(() => import('src/views/omsGlobal/OmsGlobalEditView'))
      },
      {
        exact: true,
        path: '/app/management/questLeads/:id/edit',
        component: lazy(() => import('src/views/questLead/QuestLeadsEditView'))
      },
      {
        exact: true,
        path: '/app/management/documents/:id/edit',
        component: lazy(() => import('src/views/document/DocumentEditView'))
      },
      {
        exact: true,
        path: '/app/management/makes/:id/edit',
        component: lazy(() => import('src/views/make/MakeEditView'))
      },
      {
        exact: true,
        path: '/app/management/sources/:id/edit',
        component: lazy(() => import('src/views/source/SourceEditView'))
      },
      {
        exact: true,
        path: '/app/management/vehicles/:id/edit',
        component: lazy(() => import('src/views/vehicle/VehicleEditView'))
      },
      {
        exact: true,
        path: '/app/management/stores/:id/edit',
        component: lazy(() => import('src/views/store/StoreEditView'))
      },
      {
        exact: true,
        path: '/app/management/status/:id/edit',
        component: lazy(() => import('src/views/status/StatusEditView'))
      },
      {
        exact: true,
        path: '/app/management/users/:id/edit',
        component: lazy(() => import('src/views/user/UserEditView'))
      },
      {
        exact: true,
        path: '/app/create/make',
        component: lazy(() => import('src/views/make/MakeCreateView'))
      },
      {
        exact: true,
        path: '/app/create/company',
        component: lazy(() => import('src/views/company/CompanyCreateView'))
      },
      
      {
        exact: true,
        path: '/app/create/document',
        component: lazy(() => import('src/views/document/DocumentCreateView'))
      },
      {
        exact: true,
        path: '/app/create/store',
        component: lazy(() => import('src/views/store/StoreCreateView'))
      },
      {
        exact: true,
        path: '/app/create/source',
        component: lazy(() => import('src/views/source/SourceCreateView'))
      },
      {
        exact: true,
        path: '/app/create/omsLead',
        component: lazy(() => import('src/views/omsGlobal/OmsGlobalCreateView'))
      },
      {
        exact: true,
        path: '/app/create/questLead',
        component: lazy(() => import('src/views/questLead/QuestLeadsCreateView'))
      },
      {
        exact: true,
        path: '/app/create/vehicle',
        component: lazy(() => import('src/views/vehicle/VehicleCreateView'))
      },
      {
        exact: true,
        path: '/app/create/status',
        component: lazy(() => import('src/views/status/StatusCreateView'))
      },
      {
        exact: true,
        path: '/app/create/user',
        component: lazy(() => import('src/views/user/UserCreateView'))
      },
      {
        exact: true,
        path: '/app/management',
        component: () => <Redirect to="/app/management/omsLeads" />
      },
      {
        exact: true,
        path: '/app',
        component: () => <Redirect to="/app/management/omsLeads" />
      },
      {
        component: () => <Redirect to="/404" />
      }
    ]
  },
  {
    path: '/docs',
    layout: DocsLayout,
    routes: [
      {
        exact: true,
        path: '/docs',
        component: () => <Redirect to="/docs/welcome" />
      },
      {
        exact: true,
        path: '/docs/welcome',
        component: lazy(() => import('src/views/docs/WelcomeView'))
      },
      {
        exact: true,
        path: '/docs/getting-started',
        component: lazy(() => import('src/views/docs/GettingStartedView'))
      },
      {
        exact: true,
        path: '/docs/environment-variables',
        component: lazy(() => import('src/views/docs/EnvironmentVariablesView'))
      },
      {
        exact: true,
        path: '/docs/deployment',
        component: lazy(() => import('src/views/docs/DeploymentView'))
      },
      {
        exact: true,
        path: '/docs/api-calls',
        component: lazy(() => import('src/views/docs/APICallsView'))
      },
      {
        exact: true,
        path: '/docs/analytics',
        component: lazy(() => import('src/views/docs/AnalyticsView'))
      },
      {
        exact: true,
        path: '/docs/authentication',
        component: lazy(() => import('src/views/docs/AuthenticationView'))
      },
      {
        exact: true,
        path: '/docs/routing',
        component: lazy(() => import('src/views/docs/RoutingView'))
      },
      {
        exact: true,
        path: '/docs/settings',
        component: lazy(() => import('src/views/docs/SettingsView'))
      },
      {
        exact: true,
        path: '/docs/state-management',
        component: lazy(() => import('src/views/docs/StateManagementView'))
      },
      {
        exact: true,
        path: '/docs/theming',
        component: lazy(() => import('src/views/docs/ThemingView'))
      },
      {
        exact: true,
        path: '/docs/support',
        component: lazy(() => import('src/views/docs/SupportView'))
      },
      {
        exact: true,
        path: '/docs/changelog',
        component: lazy(() => import('src/views/docs/ChangelogView'))
      },
      {
        component: () => <Redirect to="/404" />
      }
    ]
  },
  {
    path: '*',
    layout: MainLayout,
    routes: [
      {
        exact: true,
        path: '/',
        component: HomeView
      },
      {
        component: () => <Redirect to="/404" />
      }
    ]
  }
];

export default routes;
