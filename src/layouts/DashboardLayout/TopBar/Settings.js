import React, {
  useState,
  useRef,
  useEffect
} from 'react';
import { capitalCase } from 'change-case';
import {
  Box,
  Button,
  FormControlLabel,
  IconButton,
  Popover,
  SvgIcon,
  Switch,
  TextField,
  Tooltip,
  Typography,
  makeStyles
} from '@material-ui/core';
import useAuth from 'src/hooks/useAuth';
import useStore from 'src/hooks/useStore';
import { Settings as SettingsIcon } from 'react-feather';
import useSettings from 'src/hooks/useSettings';
import { THEMES } from 'src/constants';
import i18next from 'src/utils/i18next'
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  badge: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginTop: 10,
    marginRight: 5
  },
  popover: {
    width: 320,
    padding: theme.spacing(2)
  }
}));

const Settings = () => {
  const classes = useStyles();
  const ref = useRef(null);
  const { settings, saveSettings } = useSettings();
  const [alarm, setAlarm] = useState(true);
  const [language, setLanguage] = useState(false);
  const { user } = useAuth();
  const [isOpen, setOpen] = useState(false);
  const { t } = useTranslation()
  const { updateStore } = useStore();

  const [values, setValues] = useState({
    direction: settings.direction,
    responsiveFontSizes: settings.responsiveFontSizes,
    theme: settings.theme
  });

  useEffect(()=>{
    if(localStorage.getItem("language")){
      i18next.changeLanguage(localStorage.getItem("language"));
      if(localStorage.getItem("language") === 'es'){
        setLanguage(true)
      }else{
        setLanguage(false)

      }
    }else{
      localStorage.setItem("language", 'en')
      i18next.changeLanguage(localStorage.getItem("language"));
    }
  },[]);

  useEffect(() => {

    if(user && user.store){
      setAlarm(user.store.alarm)
    }
    //eslint-disable-next-line
  }, [user])

  useEffect(() => {
    if(user && user.store){
      updateStore({alarm: alarm},user.store._id)
      user.store.alarm = alarm;
    }
    //eslint-disable-next-line
  }, [alarm])

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (field, value) => {
    setValues({
      ...values,
      [field]: value
    });
  };

  const handleSave = () => {
    if(language){
      localStorage.setItem("language", 'es')
    }
    if(!language){
      localStorage.setItem("language", 'en')
    }
    i18next.changeLanguage(localStorage.getItem("language"));
    saveSettings(values);
    setOpen(false);
  };

  return (
    <>
      <Tooltip title={t("Settings.Settings")}>
          <IconButton
            color="inherit"
            onClick={handleOpen}
            ref={ref}
          >
            <SvgIcon fontSize="small">
              <SettingsIcon />
            </SvgIcon>
          </IconButton>
      </Tooltip>
      <Popover
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        classes={{ paper: classes.popover }}
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
      >
        <Typography
          variant="h4"
          color="textPrimary"
        >
          {t("Settings.Settings")}
        </Typography>
        
          {
              user && user.role === 'admin' ? (
                <Box
                mt={2}
                px={1}
              >
              <FormControlLabel
              control={
                <Switch
                  edge="start"
                  checked={alarm}
                  onChange={(e)=>{
                    setAlarm(!alarm)
                  }}
                  color="primary"
                />
              }
              label={t("Alarms.Alarm")}
              />
             
              </Box>
              
              ): false

            }
            
            <Box
          mt={2}
          px={1}
        >
          <FormControlLabel
            control={(
              <Switch
                checked={values.direction === 'rtl'}
                edge="start"
                name="direction"
                onChange={(event) => handleChange('direction', event.target.checked ? 'rtl' : 'ltr')}
              />
            )}
            label="RTL"
          />
          
        </Box>
        <Box
          mt={2}
          px={1}
        >
          <FormControlLabel
            control={(
              <Switch
                checked={language}
                edge="start"
                name="language"
                onChange={(event) => {
                    setLanguage(!language)
                }}
              />
            )}
            label="EN/ES"
          />
          
        </Box>
        <Box mt={2}>
          <TextField
            fullWidth
            label={t("Settings.Theme")}
            name="theme"
            onChange={(event) => handleChange('theme', event.target.value)}
            select
            SelectProps={{ native: true }}
            value={values.theme}
            variant="outlined"
          >
            {Object.keys(THEMES).map((theme) => (
              <option
                key={theme}
                value={theme}
              >
                {capitalCase(theme)}
              </option>
            ))}
          </TextField>
        </Box>
        <Box mt={2}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={handleSave}
          >
            {t("Settings.Save")}
          </Button>
        </Box>
      </Popover>
    </>
  );
}

export default Settings;
