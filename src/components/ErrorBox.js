import React from 'react';

const ErrorBox = ({ message }) => {
  return (
    <div className='error-box'>
      {message}
    </div>
  );
};

export default ErrorBox;
