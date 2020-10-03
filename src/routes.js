import React, { Suspense, Fragment, lazy } from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import DocsLayout from 'src/layouts/DocsLayout';
import VideoCallLayout from 'src/layouts/VideoCallLayout';
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
        path: '/app/calendar',
        component: lazy(() => import('src/views/calendar/CalendarView'))
      },
      {
        exact: true,
        path: ['/app/chat/new', '/app/chat/:threadKey'],
        component: lazy(() => import('src/views/chat/ChatView'))
      },
      {
        exact: true,
        path: '/app/chat',
        component: () => <Redirect to="/app/chat/new" />
      },
      {
        exact: true,
        path: '/app/extra/charts/linear',
        component: lazy(() => import('src/views/chartLeads/linear'))
      },
      {
        exact: true,
        path: '/app/extra/highcharts/linear',
        component: lazy(() => import('src/views/chartLeads/linearHighchart'))
      },
      {
        exact: true,
        path: '/app/extra/charts/pyramid',
        component: lazy(() => import('src/views/chartLeads/pyramid'))
      },
      {
        exact: true,
        path: '/app/extra/highcharts/pyramid',
        component: lazy(() => import('src/views/chartLeads/pyramidHighchart'))
      },
      {
        exact: true,
        path: '/app/extra/charts/all',
        component: lazy(() => import('src/views/chartLeads/all'))
      },
      {
        exact: true,
        path: '/app/extra/highcharts/all',
        component: lazy(() => import('src/views/chartLeads/allHighchart'))
      },
      {
        exact: true,
        path: '/app/extra/charts/models',
        component: lazy(() => import('src/views/chartLeads/models'))
      },
      {
        exact: true,
        path: '/app/extra/highcharts/models',
        component: lazy(() => import('src/views/chartLeads/modelsHighchart'))
      },
      {
        exact: true,
        path: '/app/extra/charts/bar',
        component: lazy(() => import('src/views/chartLeads/bars'))
      },
      {
        exact: true,
        path: '/app/extra/charts/multiple',
        component: lazy(() => import('src/views/chartLeads/multiBar'))
      },
      {
        exact: true,
        path: '/app/extra/highcharts/multiple',
        component: lazy(() => import('src/views/chartLeads/multiBarHighchart'))
      },
      {
        exact: true,
        path: '/app/extra/forms/formik',
        component: lazy(() => import('src/views/extra/forms/FormikView'))
      },
      {
        exact: true,
        path: '/app/extra/forms/redux',
        component: lazy(() => import('src/views/extra/forms/ReduxFormView'))
      },
      {
        exact: true,
        path: '/app/extra/editors/draft-js',
        component: lazy(() => import('src/views/extra/editors/DraftEditorView'))
      },
      {
        exact: true,
        path: '/app/extra/editors/quill',
        component: lazy(() => import('src/views/extra/editors/QuillEditorView'))
      },
      {
        exact: true,
        path: '/app/kanban',
        component: lazy(() => import('src/views/kanban/KanbanView'))
      },
      {
        exact: true,
        path: [
          '/app/mail/label/:customLabel/:mailId?',
          '/app/mail/:systemLabel/:mailId?'
        ],
        component: lazy(() => import('src/views/mail/MailView'))
      },
      {
        exact: true,
        path: '/app/mail',
        component: () => <Redirect to="/app/mail/all" />
      },
      {
        exact: true,
        path: '/app/management/customers',
        component: lazy(() => import('src/views/lead/LeadListView'))
      },
      {
        exact: true,
        path: '/app/management/socialAccounts',
        component: lazy(() => import('src/views/socialAccount/SocialAccountListView'))
      },
      {
        exact: true,
        path: '/app/management/makes',
        component: lazy(() => import('src/views/make/MakeListView'))
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
        path: '/app/management/companies',
        component: lazy(() => import('src/views/company/CompanyListView'))
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
        path: '/app/management/leads/:id',
        component: lazy(() => import('src/views/lead/LeadDetailsView'))
      },
      {
        exact: true,
        path: '/app/management/stores/:id',
        component: lazy(() => import('src/views/store/StoreDetailsView'))
      },
      {
        exact: true,
        path: '/app/management/companies/:id',
        component: lazy(() => import('src/views/company/CompanyDetailsView'))
      },
      {
        exact: true,
        path: '/app/management/socialAccounts/:id',
        component: lazy(() => import('src/views/socialAccount/SocialAccountDetailsView'))
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
        path: '/app/management/leads/:id/edit',
        component: lazy(() => import('src/views/lead/LeadEditView'))
      },
      {
        exact: true,
        path: '/app/management/socialAccounts/:id/edit',
        component: lazy(() => import('src/views/socialAccount/SocialAccountEditView'))
      },
      {
        exact: true,
        path: '/app/management/makes/:id/edit',
        component: lazy(() => import('src/views/make/MakeEditView'))
      },
      {
        exact: true,
        path: '/app/management/companies/:id/edit',
        component: lazy(() => import('src/views/company/CompanyEditView'))
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
        path: '/app/create/socialAccount',
        component: lazy(() => import('src/views/socialAccount/SocialAccountCreateView'))
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
        path: '/app/create/lead',
        component: lazy(() => import('src/views/lead/LeadCreateView'))
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
        path: '/app/management/invoices',
        component: lazy(() => import('src/views/invoice/InvoiceListView'))
      },
      {
        exact: true,
        path: '/app/management/invoices/:invoiceId',
        component: lazy(() => import('src/views/invoice/InvoiceDetailsView'))
      },
      {
        exact: true,
        path: '/app/management/orders',
        component: lazy(() => import('src/views/order/OrderListView'))
      },
      {
        exact: true,
        path: '/app/management/orders/:orderId',
        component: lazy(() => import('src/views/order/OrderDetailsView'))
      },
      {
        exact: true,
        path: '/app/management/products',
        component: lazy(() => import('src/views/product/ProductListView'))
      },
      {
        exact: true,
        path: '/app/management/products/create',
        component: lazy(() => import('src/views/product/ProductCreateView'))
      },
      {
        exact: true,
        path: '/app/management',
        component: () => <Redirect to="/app/management/customers" />
      },
      {
        exact: true,
        path: '/app/projects/overview',
        component: lazy(() => import('src/views/project/OverviewView'))
      },
      {
        exact: true,
        path: '/app/projects/browse',
        component: lazy(() => import('src/views/project/ProjectBrowseView'))
      },
      {
        exact: true,
        path: '/app/projects/create',
        component: lazy(() => import('src/views/project/ProjectCreateView'))
      },
      {
        exact: true,
        path: '/app/projects',
        component: lazy(() => import('src/views/project/ProjectDetailsView'))
      },
      {
        exact: true,
        path: '/app/projects',
        component: () => <Redirect to="/app/projects/browse" />
      },
      {
        exact: true,
        path: '/app/reports/dashboard',
        component: lazy(() => import('src/views/reports/DashboardView'))
      },
      {
        exact: true,
        path: '/app/reports/dashboardRockstar',
        component: lazy(() => import('src/views/reports/DashboardViewRockstar'))
      },
      {
        exact: true,
        path: '/app/reports/dashboardAdmin',
        component: lazy(() => import('src/views/reports/DashboardViewAdmin'))
      },
      {
        exact: true,
        path: '/app/reports/dashboard-alternative',
        component: lazy(() =>
          import('src/views/reports/DashboardAlternativeView')
        )
      },
      {
        exact: true,
        path: '/app/reports',
        component: () => <Redirect to="/app/reports/dashboard" />
      },
      {
        exact: true,
        path: '/app/social/feed',
        component: lazy(() => import('src/views/social/FeedView'))
      },
      {
        exact: true,
        path: '/app/social/profile',
        component: lazy(() => import('src/views/social/ProfileView'))
      },
      {
        exact: true,
        path: '/app/social',
        component: () => <Redirect to="/app/social/profile" />
      },
      {
        exact: true,
        path: '/app',
        component: () => <Redirect to="/app/reports/dashboard" />
      },
      {
        component: () => <Redirect to="/404" />
      }
    ]
  },
  {
    path: '/videocalls',
    layouts: VideoCallLayout,
    routes: [
      {
        exact: true,
        path: '/videocalls/:roomId',
        component: lazy(() => import('src/views/videoChat/VideoChatView'))
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
        exact: true,
        path: '/pricing',
        component: lazy(() => import('src/views/pricing/PricingView'))
      },
      {
        component: () => <Redirect to="/404" />
      }
    ]
  }
];

export default routes;
