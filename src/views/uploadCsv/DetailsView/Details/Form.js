import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Spinner from 'src/components/Spinner';
import { useSnackbar } from 'notistack';
import useAuth from 'src/hooks/useAuth';
import useStore from 'src/hooks/useStore';
import FilesDropzone from '../FilesDropzone';
import StoreContext from 'src/contexts/store/storeContext'

import clsx from 'clsx';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  Typography,
  Button,
  TextField,
  makeStyles,
  Grid,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import useUtils from 'src/hooks/useUtils';
import { CapitalizeNames } from 'src/utils/capitalize';
const useStyles = makeStyles(theme => ({
  root: {},
  fontWeightMedium: {
    fontWeight: theme.typography.fontWeightMedium
  }
}));

const typeLeads = ['global', 'quest'];

const Csv = ({ className, ...rest }) => {
  const storeContext = useContext(StoreContext);
  const classes = useStyles();
  const { uploadCsv, loading, error } = useUtils();
  const { enqueueSnackbar } = useSnackbar(); 
  const { stores, getStores } = useStore();
  const { user } = useAuth();
  const [attachments, setAttachment] = useState(null);
  const [sent, setSent] = useState(false);
  const [type, setType] = useState('global');
  const [storeInput, setStoreInput] = useState('');
  const [files, setFiles] = useState([]);

  const { t } = useTranslation()

  const handleChange = (e) => {
    setType(e.target.value)
    setStoreInput('global')
  }

  useEffect(() => {

    if(user && user.store && user.role === 'admin'){
      setStoreInput(user.store._id)
    }

    if(user && user.role && (user.role === 'rockstar' || user.role === 'super admin')){
      setStoreInput('global')
    }

    if(user && (user.role === 'rockstar' || user.role === 'super admin')){
      getStores();
    }
    //eslint-disable-next-line
  }, [user])

  const handleSendCvs = () =>{
    if(attachments){
      const formData = new FormData(); 
     
      // Update the formData object 
      formData.append( 
        "csv", 
        attachments, 
        attachments.name 
      ); 

      formData.append(
        "type",
        type
      )

      formData.append(
        "store",
        storeInput
      )

      if(storeInput === ''){
        enqueueSnackbar(t("Errors.SelectStore"), {
          variant: 'error'
        });
      }else{
        uploadCsv(formData)
     
        setSent(true)
      }

    }else{
      enqueueSnackbar(t("SnackBar.NoFilesLoadCsv") + ' (.xlsx)', {
        variant: 'error'
      });
    }

    
  }

  useEffect(() => {
    if(!loading && sent){
      if(error && error.error){
        enqueueSnackbar(error.error, {
          variant: 'error'
        });
        setSent(false);
      }else{
        setAttachment(null)
        setFiles([])

        enqueueSnackbar(t("SnackBar.LeadsLoaded"), {
          variant: 'success'
        });
      }
      
    }
    //eslint-disable-next-line
  }, [loading])

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title={t("Csv.Subheader")} />
      <Divider />
      <div style={{paddingLeft: 25, paddingRight: 25, marginTop: 25, marginBottom: 25}}>
      <Grid  container spacing={4}>
          {
            type !== 'global' ? (
              <Grid item md={4}  xs={12}>
                <Box mb={4}>
                  <TextField
                    select
                    required
                    fullWidth
                    variant="outlined"
                    disabled={user && user.role === 'admin'}
                    SelectProps={{ native: true }}
                    onChange={(e)=>{
                      setStoreInput(e.target.value)
                    }}
                  >
                    <option key={0} value={''}>{user && user.role === 'admin' ? CapitalizeNames(user.store.make.name) + ' ' + CapitalizeNames(user.store.name): ''}</option>
                    {
                      type === 'global' ? (<option key={1} value={'global'}></option>) : null
                    }
                    {stores && stores.map(store => (
                        <option key={store._id} value={store._id}>
                        {CapitalizeNames(store.make.name) + ' ' + CapitalizeNames(store.name)}
                        </option>
                    ))}    
                  </TextField>
                </Box>
              </Grid>
            ) : null
          }
          
        <Grid item md={4}  xs={12}>
          <Box mb={4}>
              <TextField
                select
                required
                fullWidth
                variant="outlined"
                SelectProps={{ native: true }}
                onChange={handleChange}
              >
                {
                  user && (user.role === 'rockstar' || user.role === 'super admin') ? typeLeads.map(lead => (
                    <option key={lead} value={lead}>
                    {CapitalizeNames(lead)}
                    </option>
                  )) : (
                    <option key={'leads'} value={'leads'}>
                    {CapitalizeNames('leads')}
                    </option>
                  )
                }
              
              </TextField>
          </Box>
        </Grid>
      </Grid>
      <FilesDropzone setAttachment={setAttachment} setFiles={setFiles} files={files}/>
      </div>
      <Box
        p={2}
        display="flex"
        justifyContent="flex-end"
      >
        {storeContext.loading ? (
          <>
            <Typography style={{marginTop: 10}} variant='h5'>{t("Buttons.LoadingInfo")}</Typography><Spinner style={{paddingRight: 10}} width={45}/>
          </>
          ) : (
            loading ? ( 
              <>
                <Typography style={{marginTop: 10}} variant='h5'>{t("Buttons.LoadingDocumentation")}</Typography><Spinner style={{paddingRight: 10}} width={45}/>
              </>
              ) : (
                <Button
                  color="secondary"
                  type="submit"
                  variant="contained"
                  onClick={handleSendCvs}
                >
                      {t("Csv.Title")} 
                  </Button>
              )
            )
          }
        
      </Box>
      <Box
        p={1}
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
      ></Box>
    </Card>
  );
};

Csv.propTypes = {
  className: PropTypes.string,
};

export default Csv;
