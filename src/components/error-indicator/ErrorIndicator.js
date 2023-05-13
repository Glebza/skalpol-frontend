import React from 'react';
import './ErrorIndicator.css';
import icon from './death-star.png';

const ErrorIndicator = () => {
    return (

        <div className="error-indicator">
            <img src={icon} alt="error icon"/>
            <span className="boom">BOOM!</span>
            <span>something has gone wrong</span>
            <span>( but we already learnt react )</span>
        </div>
    )
};

export default ErrorIndicator;