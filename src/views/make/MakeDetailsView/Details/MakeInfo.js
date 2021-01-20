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

const MakeInfo = ({ make, className, ...rest }) => {
  const classes = useStyles();
  const {t} = useTranslation()

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title={t("Makes.Info")}/>
      <Divider />
      <Table>
        <TableBody>
          
        <TableRow>
            <TableCell className={classes.fontWeightMedium}>ID</TableCell>
            <TableCell>
                <Typography variant="body2" color="textSecondary">
                {make && make._id ? make._id : '- - -'}
                </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("Makes.Make")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {make && make.name ? CapitalizeNames(make.name) : '- - -'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("Makes.Description")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {make && make.description ? Capitalize(make.description) : '- - -'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("Makes.CreatedAt")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {make && make.createdAt ? moment(make.createdAt).format('ll') : '- - -'}
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

MakeInfo.propTypes = {
  className: PropTypes.string,
};

export default MakeInfo;
