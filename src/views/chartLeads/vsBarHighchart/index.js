import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  makeStyles,
  TextField,
  Typography,
  ButtonGroup,
  Button,
} from '@material-ui/core';
import useMake from 'src/hooks/useMake';
import { 
  Facebook as SourceIcon,
  AlertCircle as StatusIcon,
  CloudDrizzle as TemperatureIcon
 } from 'react-feather';
import Page from 'src/components/Page';
import Header from './Header';
import useLead from 'src/hooks/useLead';
import AnalyticsChart from './LineChart';
import moment from 'moment';
import useStore from 'src/hooks/useStore';
import useStatus from 'src/hooks/useStatus';
import useSource from 'src/hooks/useSource';
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    ///
    padding: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'

  },
  avatar: {
    backgroundColor: theme.palette.text.secondary,
    color: theme.palette.secondary.contrastText,
    height: 48,
    width: 48
  }
}));
const DashboardView = ({className, ...rest}) => {

  let string = '';
  let arrCat = [];
  let arrLead = [];
  const classes = useStyles();
  const [arrayLeads, setArrayLeads] = useState([]);
  const [categories, setCategories] = useState([]);
  const [finalCat, setFinalCat] = useState([]);
  const { makes, getMakes } = useMake();
  const { getStores, stores, getStoresByMake} = useStore();
  const { leads, GetVsLeads, value, loading} = useLead();
  const [showInfo, setShowInfo] = useState('sources');
  const [makeSearch, setMakeSearch] = useState('&make=');
  const [storeSearch, setStoreSearch] = useState('');
  const [arrIds, setArrIds] = useState('')
  const [arrIdsS, setArrIdsS] = useState('')
  const { statuses, getStatuses } = useStatus();
  const { sources, getSources } = useSource();
  const [ratingSearch, setRatingSearch] = useState('');
  const [sourceSearch, setSourceSearch] = useState('');
  const [date, setDate] = useState(`&after=${moment().startOf('month').format('YYYY-MM-DD')}`);
  const [takeData, setTakeData] = useState(0);

  const handleFilterChange = (date) =>{
    console.log('handle', date)
    setDate(date)
  }

  useEffect(()=>{
    let stArr = [];
    if(statuses){
      statuses.map( st => {
        if(st.name !== 'default'){
          stArr.push({[st.name]:st._id})
        }
        return false
      })
    }
    setArrIds(stArr)
    //eslint-disable-next-line
  },[statuses])
  useEffect(()=>{
    setStoreSearch('&store=')
    //eslint-disable-next-line
  },[makeSearch])

  useEffect(()=>{
    let stArrS = [];
    if(sources){
      sources.map( st => {
        stArrS.push({[st.name]:st._id})
        return false
      })
    }
    setArrIdsS(stArrS)
    //eslint-disable-next-line
  },[sources])

  const funct = async(string)=>{
    await GetVsLeads(`store=${string}${makeSearch}${date}`)
  }

  const handleAccountChange = (array)=>{
    let res;
    string='';
    arrCat=[];
    array.map(item =>{
      arrCat.push(item.name);
      string+=`${item.id},`
    })

    funct(string);
    setCategories(arrCat)
  }

  useEffect(()=>{
    funct(string)
    //eslint-disable-next-line
  },[date])

  useEffect(()=>{
    getMakes();
    getStores();
    getSources();
    getStatuses();
    //eslint-disable-next-line 
  },[])

  useEffect(()=>{

    let makeId = makeSearch.split('=');
    string = '';
    if(makeId[1] !== ''){
      getStoresByMake(makeId[1])
    }else{
      getStores()
    }
    
    funct(string);
    //eslint-disable-next-line 
  },[makeSearch])

  useEffect(()=>{
    setArrayLeads(value)
    //eslint-disable-next-line 
  },[value])

  return (
    <Page
      className={classes.root}
      title='Dashboard'
    >
      <Container maxWidth={false}>
        <Header filterChange={handleFilterChange} accountChange={handleAccountChange}/>
        <Grid
          container
          spacing={3}
        >
            <Grid item xs={6} md={6}>
            <Typography variant='body1' color='textPrimary'>
                Make
            </Typography>
            <TextField
                fullWidth
                name="make"
                onChange={(e)=>{ 
                  setMakeSearch(`&make=${e.target.value}`)
                }}
                select
                variant="outlined"
                SelectProps={{ native: true }}
                >
                <option key={0} value={''}>All</option>

                {makes && makes.map(make => (
                    <option key={make._id} value={make._id}>
                    {make.name.charAt(0).toUpperCase() + make.name.slice(1)}
                    </option>
                ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={12} container
              direction="row"
              justify="center"
              alignItems="center">
              <ButtonGroup color="primary" size='large' >
                <Button style={{'textTransform': 'capitalize'}} variant={showInfo === 'sources' ? 'contained' : 'outlined'}  onClick={(e)=>{ 
                  setShowInfo('sources') 
                }}><SourceIcon /><p style={{marginLeft: 5, fontSize: 14}}>Source</p></Button>
                 <Button style={{'textTransform': 'capitalize'}} variant={showInfo === 'temperatures' ? 'contained' : 'outlined'}  onClick={(e)=>{
                  setShowInfo('temperatures') 
                }}><TemperatureIcon /><p style={{marginLeft: 5, fontSize: 14}}>Temperatures</p></Button>
                <Button style={{'textTransform': 'capitalize'}} variant={showInfo === 'statuses' ? 'contained' : 'outlined'}  onClick={(e)=>{
                  setShowInfo('statuses') 
                }}><StatusIcon /><p style={{marginLeft: 5, fontSize: 14}}>Status</p></Button>
              </ButtonGroup>
            </Grid>
          <Grid
            item
            md={12}
            lg={12}
            xs={12}
            sm={12}
          >
            <AnalyticsChart leads={arrayLeads} categories={categories} ids={arrIds} idsS={arrIdsS} showInfo={showInfo}/>
        </Grid>
          </Grid>
      </Container>
    </Page>
  );
};

export default DashboardView;