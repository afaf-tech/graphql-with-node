import React from 'react';

import './Spinner.css';
import logo from './Bean Eater-1s-200px.svg';

const spinner = () =>(

    <div className="spinner">
    <div className="lds-dual-ring"><img src={logo} alt="logo"/></div>;
    </div>
    )

export default spinner;