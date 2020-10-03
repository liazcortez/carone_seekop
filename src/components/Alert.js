import React from "react";
import useAlert from 'src/hooks/useAlert';
import { FormHelperText } from '@material-ui/core';

const Alerta = (props) => {
  const { alert } = useAlert();

  return (
    alert !== null && (
      <FormHelperText error>
        {props.msg && props.msg}
      </FormHelperText>
    )
  );
};
export default Alerta;
