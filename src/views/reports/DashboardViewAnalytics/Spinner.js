import React, {Fragment} from 'react';
import spinner from './loading.gif';
import {Box} from '@material-ui/core'

const Spinner = ({...rest}) => {
    return (
        <div>
            <Fragment>
            <Box
                mb={8}
                display="flex"
                justifyContent="center"
            >
                    <img src={spinner} alt="loading...." style={{width: rest.width, margin:"auto", display: "block"}}/>
                </Box>
            </Fragment>
        </div>
    )
}

export default Spinner;
