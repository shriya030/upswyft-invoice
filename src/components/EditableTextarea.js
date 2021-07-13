import React from 'react'
import compose from '../styles/compose'


function EditableTextarea({
  className,
  placeholder,
  value,
  onChange,
  pdfMode,
  rows,
}){
  return (
    <>
      {pdfMode ? (
        <div style={compose('span ' + (className ? className : ''))}>{value}</div>
      ) : (
        <textarea
          minRows={rows || 1}
          className={'input ' + (className ? className : '')}
          placeholder={placeholder || ''}
          value={value || ''}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        />
      )}
    </>
  )
}

export default EditableTextarea
