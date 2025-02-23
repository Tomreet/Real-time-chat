import React from 'react';

const MyBackground = ({main}) => {
    return (
        <div className="MyBackground">
            <div className="Left"></div>
            <div className="Right"></div>
            {main}
        </div>
    );
};

export default MyBackground;