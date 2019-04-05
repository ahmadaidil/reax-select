import React from 'react'
import PropTypes from 'prop-types'

import { SelectStyled } from './styled'

export default function Select({
  options,
  value,
  onChange
}) {
  return (
    <>
      <SelectStyled
        value={value}
        onChange={onChange}
        isPlaceholder={value === ''}
      >
        <option disabled hidden value="">Select...</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>{option.label}</option>
        ))}
      </SelectStyled>
    </>
  )
}

Select.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}
