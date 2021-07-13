import React from 'react';
import compose from '../styles/compose'

function EditableInput({ className, placeholder, value, onChange, pdfMode }) {
   return (
    <>
      {pdfMode ? (
        <div style={compose('span ' + (className ? className : ''))}>{value}</div>
      ) : (
        <input
          type="text"
          className={'input ' + (className ? className : '')}
          placeholder={placeholder || ''}
          value={value || ''}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        />
      )}
    </>
   )
}

export default EditableInput

