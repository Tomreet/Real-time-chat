import React from 'react';

const MyButton = ({type, className, onClick, disabled, icon, text, style}) => {
    return (
        <button 
            type={type}
            className={className}
            onClick={onClick}
            disabled={disabled || false}
            style={style}
        >
            {icon} {text}
        </button>
    );
};

export default MyButton;