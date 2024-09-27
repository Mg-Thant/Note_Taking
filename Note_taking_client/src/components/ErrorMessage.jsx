import { ErrorMessage } from 'formik';
import React from 'react';

const Error_message = ({name}) => {
  return (
    <div className='text-red-600 font-mono'>
      <ErrorMessage name={name}/>
    </div>
  )
}

export default Error_message
