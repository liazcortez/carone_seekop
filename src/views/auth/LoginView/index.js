import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Link,
  Typography,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Logo from 'src/components/Logo';
import JWTLogin from './JWTLogin';
import { useTranslation } from 'react-i18next';
import i18next from 'src/utils/i18next';

const methodIcons = {
  'Auth0': '/static/images/auth0.svg',
  'FirebaseAuth': '/static/images/firebase.svg',
  'JWT': '/static/images/jwt.svg'
};


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
  },
  banner: {
    backgroundColor: theme.palette.background.paper,
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  bannerChip: {
    marginRight: theme.spacing(2)
  },
  methodIcon: {
    height: 30,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  },
  cardContainer: {
    paddingBottom: 80,
    paddingTop: 80,
  },
  cardContent: {
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    minHeight: 400
  },
  currentMethodIcon: {
    height: 40,
    '& > img': {
      width: 'auto',
      maxHeight: '100%'
    }
  },
  rightText: {
    float: "right"
  }
}));

const LoginView = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  useEffect(()=>{
    let language;
    if(localStorage.getItem("i18nextLng")){
      language = localStorage.getItem("i18nextLng")
    }else{
      language = 'en'
    }
      i18next.changeLanguage(language);
  },[]);

  return (
    <Page
      className={classes.root}
      title="Login"
    >
      <Container
        className={classes.cardContainer}
        maxWidth="sm"
      >
        <Box
          mb={8}
          display="flex"
          justifyContent="center"
        >
          <RouterLink to="/">
            <Logo />
          </RouterLink>
        </Box>
        <Card>
          <CardContent className={classes.cardContent}>
            <Box
              alignItems="center"
              display="flex"
              justifyContent="space-between"
              mb={3}
            >
              <div>
                <Typography
                  color="textPrimary"
                  gutterBottom
                  variant="h2"
                >
                  {t('Login.SignIn')}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                >
                   {t('Login.SignIn2')}
                </Typography>
              </div>
              <div className={classes.currentMethodIcon}>
                <img
                  alt="Auth method"
                  src={methodIcons["JWT"]}
                />
              </div>
            </Box>
            <Box
              flexGrow={1}
              mt={3}
            >
             
              <JWTLogin /> 
              <Box mt={3}
                >
                <Link
                  component={RouterLink}
                  to="/forgotPassword"
                  variant="body2"
                  color="textSecondary"
                  className={classes.rightText}
                >
                  {t('Login.ForgotPsw')}

                </Link>
              </Box>
              
            </Box>
            <Box my={3}>
              <Divider />
            </Box>
            <Link
              component={RouterLink}
              to="/register"
              variant="body2"
              color="textSecondary"
            >
              {t("Login.NewAccount")}
            </Link>
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
};

export default LoginView;
