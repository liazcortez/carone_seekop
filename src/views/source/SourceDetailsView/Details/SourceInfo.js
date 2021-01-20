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
import { useTranslation } from 'react-i18next';
import {Capitalize, CapitalizeNames} from 'src/utils/capitalize';
import moment from 'moment'
const useStyles = makeStyles(theme => ({
  root: {},
  fontWeightMedium: {
    fontWeight: theme.typography.fontWeightMedium
  }
}));

const SourceInfo = ({ source, className, ...rest }) => {
  const classes = useStyles();
  const { t } = useTranslation()

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title={t("Sources.Info")} />
      <Divider />
      <Table>
        <TableBody>
        <TableRow>
            <TableCell className={classes.fontWeightMedium}>ID</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {source && source._id ? source._id : '- - -'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("Sources.Name")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {source && source.name ? CapitalizeNames(source.name) : '- - -'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("Sources.Description")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {source && source.description ? Capitalize(source.description) : '- - -'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("Sources.CreatedAt")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {source && source.createdAt ? moment(source.createdAt).format('ll') : '- - -'}
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

SourceInfo.propTypes = {
  className: PropTypes.string,
  source: PropTypes.object.isRequired
};

export default SourceInfo;
