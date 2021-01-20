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
import { Download as DownloadIcon } from 'react-feather'
import { CapitalizeNames } from 'src/utils/capitalize';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
const useStyles = makeStyles(theme => ({
  root: {},
  fontWeightMedium: {
    fontWeight: theme.typography.fontWeightMedium
  },
  download: {
    color: theme.palette.text.primary
  }
}));

const DocumentInfo = ({ document, className, ...rest }) => {
  const classes = useStyles();
  const { t } = useTranslation()

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title={t("Documents.Info")} />
      <Divider />
      <Table>
        <TableBody>
        <TableRow>
            <TableCell className={classes.fontWeightMedium}>ID</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {document && document._id ? document._id : ''}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("Documents.Title")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {document && document.title ? CapitalizeNames(document.title) : ''}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("Documents.File")}</TableCell>
            <TableCell>
              <a
                className={classes.download}
                href={`${process.env.REACT_APP_URL_IMAGE_S3_URL}${document && document.file}`}
                download
              >
                <DownloadIcon/>
              </a>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("Documents.Store")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {document && document.store && document.store.make ? CapitalizeNames(document.store.make.name) + ' ' + CapitalizeNames(document.store.name) : ''}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("Documents.CreatedAt")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {document && document.createdAt ? moment(document.createdAt).format('ll') : ''}
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

DocumentInfo.propTypes = {
  className: PropTypes.string,
  document: PropTypes.object.isRequired
};

export default DocumentInfo;
