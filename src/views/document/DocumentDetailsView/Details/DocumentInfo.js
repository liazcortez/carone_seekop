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
import moment from 'moment';
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

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Document info" />
      <Divider />
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Title</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {document && document.title ? document.title : ''}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>File</TableCell>
            <TableCell>
              <a
                className={classes.download}
                href={`https://automotive-api.s3.us-east-2.amazonaws.com/${document && document.file}`}
                download
              >
                <DownloadIcon/>
              </a>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Store</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {document && document.store && document.store.make ? document.store.make.name + ' ' + document.store.name : ''}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Created At</TableCell>
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
