import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';  
import useLead from 'src/hooks/useLead';
import { useParams, useHistory } from 'react-router';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    makeStyles,
  } from '@material-ui/core';
  import {
    Delete as DeleteIcon
  
  } from 'react-feather';
  
  const useStyles = makeStyles((theme) => ({
    root: {},
    cell: {
      padding: theme.spacing(1)
    },
    error: {
      color: theme.palette.common.white,
      backgroundColor: theme.palette.error.main,
      "&:hover": {
        backgroundColor: "#d0392e"
      }
    },
  }));
  
  const DeleteLead = ({ className, ...rest }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const { deleteLead, getLeads } = useLead();
    const route = useParams();
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();  

    const handleDelete = () =>{
        deleteLead(route.id);
        getLeads();
        enqueueSnackbar(t("SnackBar.LeadDeleted"), {
          variant: 'error'
        });
        history.push("/app/management/questLeads");
    }
    
    return (
      <Card
        className={clsx(classes.root, className)}
        {...rest}
      >
        <CardHeader title={t("Title.Delete")} />
        <Divider />
        <CardContent>
            <Box
              mt={2}
            >
                <Button
                    variant="contained"
                    type="submit"
                    size="large"
                    fullWidth
                    startIcon={<DeleteIcon />}
                    onClick={handleDelete}
                    className={classes.error}
                    >
                    {t("Title.Delete")} {t("Leads.Lead")}
                </Button>
            </Box>
        </CardContent>
      </Card>
    );
  };
  
  DeleteLead.propTypes = {
    className: PropTypes.string,
  };
  
  export default DeleteLead;
  