/*eslint no-unused-vars: 0*/
import React, { useRef, useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import useSocialAccount from 'src/hooks/useSocialAccount';
import useAuth from 'src/hooks/useAuth';
import {
  Breadcrumbs,
  Button,
  Grid,
  Link,
  Menu,
  MenuItem,
  SvgIcon,
  Typography,
  makeStyles,
  Checkbox,
  
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { 
  Calendar as CalendarIcon,
  User as UserIcon,
  Check as CheckIcon,
  Minus as CrossIcon
 } from 'react-feather';
 const timeRanges = [
  {
    value: 'today',
    text: 'Today'
  },
  {
    value: 'yesterday',
    text: 'Yesterday'
  },
  {
    value: 'month',
    text: 'This month'
  },
  {
    value: '6month',
    text: 'Last 6 months'
  },
  {
    value: 'year',
    text: 'This year'
  }
];

const useStyles = makeStyles(() => ({
  root: {},
  selectedCheck: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)'
  }
}));

let ArrayName = {};
let ArrayIds = {};

const Header = ({ className, filterChange, accountChange, ...rest }) => {
  const classes = useStyles();
  const actionRef = useRef(null);
  const actionRef2 = useRef(null);
  const { getSocialAccounts, socialAccounts, getSocialAccountByStore } = useSocialAccount();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isMenuOpen2, setMenuOpen2] = useState(false);
  const [timeRange, setTimeRange] = useState(timeRanges[2].text);
  const [storeName, setStoreName] = useState('All');
  const [state, setState] = useState();
  const { user } = useAuth();

  const [ids, setIds] = useState();

  
  useEffect(()=>{
    if(user && user.role && user.store){
      if(user.role === 'admin'){
        getSocialAccountByStore(user.store._id)
      }else if(user.role === 'super admin' || user.role === 'rockstar'){
        getSocialAccounts();
      }
    }
    //eslint-disable-next-line 
  },[user])
  useEffect(()=>{
    if(socialAccounts){
      // ArrayName['all'] = true;
      socialAccounts.map(sa => ArrayName[sa.name] = true);
      setState(ArrayName)

      // ArrayIds['all'] = 'all';
      socialAccounts.map(sa => ArrayIds[sa.name] = sa.account);
      setIds(ArrayIds)
    }
    //eslint-disable-next-line
  },[socialAccounts])

  // const { all, kia1, kia2 } = state;

  const handleChange = event => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  useEffect(()=>{
     let arrayIds = [];

     const keys = [];
     for (var k in ArrayName) keys.push(k);

     if(state && ids){
       if(state.all){
         keys.map(id => {
           if(ids[id] !== 'all'){
             arrayIds.push({account: ids[id], name: id})
           }
           return 0;
         })
         accountChange(arrayIds)
       }else{
         keys.map(id =>{
           if(state[id] === true){
            arrayIds.push({account: ids[id], name: id})

           }
           return 0;

         })
         accountChange(arrayIds)
       }
     }
    //eslint-disable-next-line
  }, [state]);
  const handleChangeTime = filter => {
    setTimeRange(filter);
    switch (filter) {
      case 'today':
        filterChange('today');
        break;
      case 'yesterday':
        filterChange('yesterday');
        break;
      case 'month':
        filterChange('month');
        break;
      case '6month':
        filterChange('6month');
        break;
      case 'year':
        filterChange('year');
        break;
      default:
        break;
    }
  };

  return (
    <Grid
      container
      spacing={3}
      justify="space-between"
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Grid item md={12} lg={6} xs={12} sm={12}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          <Typography
            variant="body1"
            color="textPrimary"
          >
            Dashboard
          </Typography>
          <Typography
            variant="body1"
            color="textPrimary"
          >
            Facebook Ads
          </Typography>
        </Breadcrumbs>
      </Grid>
      <Grid item>
        {
          user && (user.role === 'rockstar' || user.role === 'super admin') ? (
            <Button
              style={{ marginRight: 25 }}
              ref={actionRef2}
              onClick={() => setMenuOpen2(true)}
              startIcon={
                <SvgIcon fontSize="small">
                  <UserIcon />
                </SvgIcon>
              }
            >
              Filter
            </Button>
          ) : false
        }
        
        <Menu
          anchorEl={actionRef2.current}
          onClose={() => setMenuOpen2(false)}
          open={isMenuOpen2}
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
          {
            socialAccounts.map(sa => (
              <MenuItem
              key={sa.account}
              name={sa.name}
              onClick={(e) => {
                setState({ ...state, [sa.name]: !state[sa.name] });
                setStoreName(sa.name)
              }}
            >
              <Checkbox style={{display: 'none'}} checked={true} onChange={handleChange} name={sa.name}/>   

              <Grid container>
                <Grid item md={1} >
                {state && state[sa.name] ? 
              (
              <SvgIcon fontSize="small" style={{fontSize: 14}}>
                <CheckIcon />
              </SvgIcon>
              ) : false}
                </Grid>
                <Grid item md={11}>
                  {sa.name}
                </Grid>
              </Grid>
              
              
            </MenuItem>
            ))
          }
          {/* <MenuItem
              className={kia1 ? classes.selectedCheck : ''}
              key={'act_561997060883231'}
              onClick={(e) => {
                setState({ ...state, kia1: !kia1 });
                setStoreName('Kia Gonzalitos')
              }}
            >
            <Checkbox style={{display: 'none'}} checked={kia1} onChange={handleChange} name='kia1' />   
            
              Kia Gonzalitos
            </MenuItem>
            <MenuItem
              className={kia2 ? classes.selectedCheck : ''}
              key={'act_231851847493209'}
              onClick={(e) => {
                setState({ ...state, kia2: !kia2 });
                setStoreName('Kia Linda Vista')
              }}
            >
            <Checkbox style={{display: 'none'}} checked={kia2} onChange={handleChange} name='kia2' />   
            
              Kia Linda Vista
            </MenuItem> */}
            </Menu>
        
        
        <Button
          ref={actionRef}
          onClick={() => setMenuOpen(true)}
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
              onClick={e => handleChangeTime(_timeRange.value)}
            >
              {_timeRange.text}
            </MenuItem>
          ))}
        </Menu>
      </Grid>
    </Grid>
  );
};

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
