import React, {Fragment} from 'react';
import spinner from './loading.gif';

const Spinner = ({...rest}) => {
    return (
        <div>
            <Fragment>
                <img src={spinner} alt="loading...." style={{width: rest.width, margin:"auto", display: "block"}}/>
            </Fragment>
        </div>
    )
}

export default Spinner;
