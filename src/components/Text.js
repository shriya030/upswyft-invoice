import React from 'react'
import compose from '../styles/compose'


function Text({ className, pdfMode, children }) {
  return (
    <>
      {pdfMode ? (
        <div style={compose('span ' + (className ? className : ''))}>{children}</div>
      ) : (
        <span className={'span ' + (className ? className : '')}>{children}</span>
      )}
    </>
  )
}

export default Text
