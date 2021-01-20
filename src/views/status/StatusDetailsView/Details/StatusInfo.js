import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  makeStyles
} from '@material-ui/core';
import {Capitalize, CapitalizeNames} from 'src/utils/capitalize';
import { useTranslation } from 'react-i18next';
import moment from 'moment'
const useStyles = makeStyles(theme => ({
  root: {},
  fontWeightMedium: {
    fontWeight: theme.typography.fontWeightMedium
  }
}));

const StatusInfo = ({ status, className, ...rest }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title={t("Status.Info")} />
      <Divider />
      <Table>
        <TableBody>
        <TableRow>
            <TableCell className={classes.fontWeightMedium}>ID</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {status && status._id ? status._id : '- - -'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("Status.Name")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {status && status.name ? CapitalizeNames(status.name) : '- - -'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("Status.Description")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {status && status.description ? Capitalize(status.description) : '- - -'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("Status.CreatedAt")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {status && status.createdAt ? moment(status.createdAt).format('ll') : '- - -'}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Box
        p={1}
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
      ></Box>
    </Card>
  );
};

StatusInfo.propTypes = {
  className: PropTypes.string,
};

export default StatusInfo;
