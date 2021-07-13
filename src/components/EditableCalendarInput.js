import React from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import compose from '../styles/compose'


function EditableCalendarInput({ className, value, selected, onChange, pdfMode }){
  return (
    <>
      {pdfMode ? (
        <div style={compose('span ' + (className ? className : ''))}>{value}</div>
      ) : (
        <DatePicker
          className={'input ' + (className ? className : '')}
          selected={selected}
          onChange={onChange ? (date) => onChange(date) : (date) => null}
          dateFormat="dd-MM-yyyy"
        />
      )}
    </>
  )
}

export default EditableCalendarInput
