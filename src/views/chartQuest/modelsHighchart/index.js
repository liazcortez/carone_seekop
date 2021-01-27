import React, { useEffect, useState, useRef } from 'react';
import {
  Container,
  Grid,
  makeStyles,
  Breadcrumbs,
  Button,
  Link,
  Menu,
  MenuItem,
  SvgIcon,
  Typography,
  TextField,
  ButtonGroup,
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import Page from 'src/components/Page';
import Chart from './Chart';
import BackDrop from 'src/components/Backdrop';
import { CapitalizeNames } from 'src/utils/capitalize';
import useQuestLead from 'src/hooks/useQuestLead';
import moment from 'moment';
import useStore from 'src/hooks/useStore';
import { 
  Calendar as CalendarIcon,
  BarChart2 as BarIcon,
  Circle as CakeIcon
 } from 'react-feather';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import useAuth from 'src/hooks/useAuth';
import useStatus from 'src/hooks/useStatus';
import useSource from 'src/hooks/useSource';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));
let contar = 0;
let reloadBool = false;
const ApexChartsView = ({ className, ...rest }) => {
  const classes = useStyles();
  const { chart, getQuestLeadsAR, loading, clearState } = useQuestLead();
  const { user } = useAuth();
  const [drill, setDrill] = useState(false);
  const { statuses, getStatuses } = useStatus();
  const { sources, getSources } = useSource();
  const actionRef = useRef(null);
  const { stores, getStores } = useStore();
  const [storeSearch, setStoreSearch] = useState('');
  const [typeBar, setTypeBar] = useState('column');
  const { t } = useTranslation()
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [makeSearch, setMakeSearch] = useState('');
  const [sourceSearch, setSourceSearch] = useState('');
  const [statusSearch, setStatusSearch] = useState('');
  const [date, setDate] = useState(`&after=${moment().startOf('month').format('YYYY-MM-DD')}`);

  
  const timeRanges = [
    {
      value: 'today',
      text: t("Calendar.Today")
    },
    {
      value: 'yesterday',
      text: t("Calendar.Yesterday")
    },
    {
      value: 'month',
      text: t("Calendar.ThisMonth")
    },
    {
      value: '6month',
      text: t("Calendar.6Months")
    },
    {
      value: 'year',
      text: t("Calendar.Year")
    }
  ];

  const [timeRange, setTimeRange] = useState(timeRanges[2].text);

  useEffect(()=>{
    clearState();
    getStatuses();
    getSources();
    getStores();
    contar ++;

    //eslint-disable-next-line
  },[])

  useEffect(()=>{
    if(user.store){
      if(user.role !== 'rockstar' && user.role !== 'super admin'){
      setMakeSearch(`&make=${user.store.make._id}`)
      }
    }
    //eslint-disable-next-line
  },[user])


  useEffect(()=>{
    setStoreSearch('&store=')
    contar ++;
    //eslint-disable-next-line
  },[makeSearch])

  useEffect(()=>{
    if(contar > 2){
      getQuestLeadsAR(`${makeSearch}${statusSearch}${sourceSearch}${storeSearch}${date}&chart=modelHC`)
    }
    contar++
    //eslint-disable-next-line
  },[makeSearch, statusSearch, sourceSearch, storeSearch, date])

  const reload = ()=>{
    reloadBool = true;
    if(!drill)
    getQuestLeadsAR(`${makeSearch}${statusSearch}${sourceSearch}${storeSearch}${date}&chart=modelHC`)

  }

  const handleChangeTime = filter => {
    setTimeRange(filter);
    switch (filter) {
      case 'today':
        setDate(`&after=${moment().format('YYYY-MM-DD')}`)

        break;
      case 'yesterday':
        setDate(`&after=${moment()
          .subtract('1', 'days')
          .format('YYYY-MM-DD')}&before=${moment().format(
          'YYYY-MM-DD'
        )}`);

        break;
      case 'month':
        setDate(`&after=${moment().startOf('month').format('YYYY-MM-DD')}`);

        break;
      case '6month':
        setDate(`&after=${
          moment()
            .startOf('month')
            .subtract('6', 'months').format('YYYY-MM-DD')
        }`);

        break;
      case 'year':
        setDate(`&after=${
          moment()
            .startOf('month')
            .subtract('12', 'months').format('YYYY-MM-DD')
        }`);
        break;

      default:
        break;
    }
  };
  

  return (
    <Page className={classes.root} title="ApexCharts">
      <BackDrop loading={loading}  chart={chart} />

      <Container maxWidth={false}>
        <Grid container spacing={3} justify="space-between" style={{marginBottom: 35}}>
          <Grid item>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="breadcrumb"
            >
              <Link
                variant="body1"
                color="inherit"
                to="/app"
                component={RouterLink}
              >
                {t("BreadCumbs.Dashboard")}
              </Link>
              <Typography variant="body1" color="textPrimary">
                  {t("BreadCumbs.Reports")}
              </Typography>
              <Typography variant="body1" color="textPrimary">
                  {t("BreadCumbs.Charts")}
              </Typography>
            </Breadcrumbs>
            <Typography variant="h3" color="textPrimary">
            {t("Charts.Models")}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              ref={actionRef}
              onClick={() => {
                if(!drill){
                  setMenuOpen(true);
                }}}
              startIcon={
                <SvgIcon fontSize="small">
                  <CalendarIcon />
                </SvgIcon>
              }
            >
              {timeRange}
            </Button>
            <Menu
              anchorEl={actionRef.current}
              onClose={() => setMenuOpen(false)}
              open={isMenuOpen}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center'
              }}
            >
              {timeRanges.map(_timeRange => (
                <MenuItem
                  key={_timeRange.value}
                  onClick={e => {
                    handleChangeTime(_timeRange.value)
                    setMenuOpen(false)
                  }}
                >
                  {_timeRange.text}
                </MenuItem>
              ))}
            </Menu>
          </Grid>
        </Grid>

        <Grid container spacing={3} style={{marginBottom: 35}}>
          <Grid item xs={4} md={4}>
            <Typography variant='body1' color='textPrimary'>
            {t("Charts.Status")}
            </Typography>
            <TextField
                fullWidth
                name="status"
                onChange={(e)=>{ 
                  setStatusSearch(`&status=${e.target.value}`)
                }}
                select
                required
                variant="outlined"
                SelectProps={{ native: true }}
                disabled={drill}

                >
                <option key={0} value={''}>{t("Tabs.All")}</option>

                {statuses && statuses.map(status => (
                  status.name !== 'default' ?
                    (<option key={status._id} value={status._id}>
                    {CapitalizeNames(status.name)}
                    </option>): false
                ))}
            </TextField>
            </Grid>
            <Grid item xs={4} md={4}>
            <Typography variant='body1' color='textPrimary'>
            {t("Charts.Source")}
            </Typography>
            <TextField
                fullWidth
                name="source"
                onChange={(e)=>{ 
                  setSourceSearch(`&source=${e.target.value}`)
                }}
                select
                required
                variant="outlined"
                SelectProps={{ native: true }}
                disabled={drill}

                >
                <option key={0} value={''}>{t("Tabs.All")}</option>

                {sources && sources.map(source => (
                    <option key={source._id} value={source._id}>
                    {CapitalizeNames(source.name)}
                    </option>
                ))}
            </TextField>
            </Grid>
            <Grid item xs={4} md={4}>
          <Typography variant='body1' color='textPrimary'>
          {t("Charts.Store")}
            </Typography>
            <TextField
                fullWidth
                name="store"
                onChange={(e)=>{ setStoreSearch(`&store=${e.target.value}`)}}
                select
                required
                variant="outlined"
                SelectProps={{ native: true }}
                disabled={drill}

                >
                <option key={0} value={''}>{t("Tabs.All")}</option>

                {stores && stores.map(store => (
                    <option key={store._id} value={store._id}>
                    {CapitalizeNames(store.make.name) + ' ' + CapitalizeNames(store.name)}
                    </option>
                ))}
            </TextField>
            </Grid>
            <Grid item xs={12} md={12} container
              direction="row"
              justify="center"
              alignItems="center">
              <ButtonGroup color="primary" size='large' >
                <Button style={{'textTransform': 'capitalize'}} variant={typeBar === 'column' ? 'contained' : 'outlined'}  onClick={(e)=>{ 
                  if(!drill){
                    setTypeBar('column') 
                  }
                }}><BarIcon /> <p style={{marginLeft: 5, fontSize: 14}}>{t("Charts.Bar")}</p></Button>
                <Button style={{'textTransform': 'capitalize'}} variant={typeBar === 'pie' ? 'contained' : 'outlined'}  onClick={(e)=>{
                  if(!drill){
                    setTypeBar('pie') 
                  }
                }}><CakeIcon /><p style={{marginLeft: 5, fontSize: 14}}>{t("Charts.Cake")}</p></Button>
              </ButtonGroup>
            </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12}> 
           <Chart leads={chart}  setDrill={setDrill}  type={typeBar} reload={reload} reloadBool={reloadBool}/>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default ApexChartsView;
