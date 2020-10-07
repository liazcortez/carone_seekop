import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { create } from 'jss';
import rtl from 'jss-rtl';
import MomentUtils from '@date-io/moment';
import { SnackbarProvider } from 'notistack';
import { jssPreset, StylesProvider, ThemeProvider } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import GlobalStyles from 'src/components/GlobalStyles';
import ScrollReset from 'src/components/ScrollReset';
import CookiesNotification from 'src/components/CookiesNotification';
import GoogleAnalytics from 'src/components/GoogleAnalytics';
import SettingsNotification from 'src/components/SettingsNotification';
import useSettings from 'src/hooks/useSettings';
import { createTheme } from 'src/theme';
import routes, { renderRoutes } from 'src/routes';
import AuthState from './contexts/auth/AuthState';
import LeadState from './contexts/lead/LeadState';
import StoreState from './contexts/store/StoreState';
import MakeState from './contexts/make/MakeState';
import SourceState from './contexts/source/SourceState';
import CommentState from './contexts/comment/CommentState';
import VehicleState from './contexts/vehicle/VehicleState';
import StatusState from './contexts/status/StatusState';
import AlertState from './contexts/alert/AlertState';
import UserState from './contexts/user/UserState';
import AppointmentState from './contexts/appointment/AppointmentState';
import TaskState from './contexts/task/TaskState';
import ActivityState from './contexts/activities/ActivityState';
import MailState from './contexts/mail/MailState';
import DocumentState from './contexts/document/DocumentState';
import CompanyState from './contexts/company/CompanyState';
import MailMarketingState from './contexts/mailMarketing/MailMarketingState';
import SocialAccount from './contexts/socialAccount/SocialAccountState';


const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const history = createBrowserHistory();

const App = () => {
  const { settings } = useSettings();


  const theme = createTheme({
    direction: settings.direction,
    responsiveFontSizes: settings.responsiveFontSizes,
    theme: settings.theme
  });

  return (
    <ThemeProvider theme={theme}>
      <StylesProvider jss={jss}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <SnackbarProvider dense maxSnack={3}>
            <Router history={history}>

              <AlertState>
                <AuthState>
                  <UserState>
                    <LeadState>
                      <CommentState>
                        <AppointmentState>
                          <MakeState>
                            <StoreState>
                              <VehicleState>
                                <SourceState>
                                  <StatusState>
                                    <ActivityState>
                                      <SocialAccount>
                                        <TaskState>
                                          <CompanyState>
                                            <MailState>
                                              <MailMarketingState>
                                                <DocumentState>
                                                  <GlobalStyles />
                                                  <ScrollReset />
                                                  <GoogleAnalytics />
                                                  <CookiesNotification />
                                                  <SettingsNotification />
                                                  {renderRoutes(routes)}
                                                </DocumentState>
                                              </MailMarketingState>
                                            </MailState>
                                          </CompanyState>
                                        </TaskState>
                                      </SocialAccount>
                                    </ActivityState>
                                  </StatusState>
                                </SourceState>
                              </VehicleState>
                            </StoreState>
                          </MakeState>
                        </AppointmentState>
                      </CommentState>
                    </LeadState>
                  </UserState>
                </AuthState>
              </AlertState>


            </Router>
          </SnackbarProvider>
        </MuiPickersUtilsProvider>
      </StylesProvider>
    </ThemeProvider>
  );
};

export default App;
