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
import GoogleAnalytics from 'src/components/GoogleAnalytics';
import SettingsNotification from 'src/components/SettingsNotification';
import useSettings from 'src/hooks/useSettings';
import { createTheme } from 'src/theme';
import routes, { renderRoutes } from 'src/routes';
import AuthState from './contexts/auth/AuthState';
import StoreState from './contexts/store/StoreState';
import MakeState from './contexts/make/MakeState';
import SourceState from './contexts/source/SourceState';
import CommentState from './contexts/comment/CommentState';
import VehicleState from './contexts/vehicle/VehicleState';
import StatusState from './contexts/status/StatusState';
import AlertState from './contexts/alert/AlertState';
import UserState from './contexts/user/UserState';
import ActivityState from './contexts/activities/ActivityState';
import OmsGlobalState from './contexts/omsGlobal/OmsGlobalState';
import QuestLeadState from './contexts/questLead/QuestLeadState';
import CompanyState from './contexts/company/CompanyState';
import MailState from './contexts/mail/MailState';
import DocumentState from './contexts/document/DocumentState';
import UtilsState from './contexts/utils/UtilsState';
import ConversationState from './contexts/conversations/ConversationsState';

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
                    <CompanyState>
                      <QuestLeadState>
                        <OmsGlobalState>
                          <CommentState>
                            <MakeState>
                              <StoreState>
                                <VehicleState>
                                  <SourceState>
                                    <StatusState>
                                      <ActivityState>
                                        <UtilsState>
                                          <MailState>
                                            <DocumentState>
                                              <ConversationState>
                                                <GlobalStyles />
                                                <ScrollReset />
                                                <GoogleAnalytics />
                                                <SettingsNotification />
                                                  {renderRoutes(routes)}
                                              </ConversationState>
                                            </DocumentState>
                                          </MailState>
                                        </UtilsState>
                                      </ActivityState>
                                    </StatusState>
                                  </SourceState>
                                </VehicleState>
                              </StoreState>
                            </MakeState>
                          </CommentState>
                        </OmsGlobalState>
                      </QuestLeadState>
                    </CompanyState>
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
