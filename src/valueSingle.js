import React from 'react'
import PropTypes from 'prop-types'
import SelectLabel from './label'

function ValueSingle(props) {
  const Label = props.labelComponent || SelectLabel

  return (
    React.createElement(
      Label, Object.assign({
        active: true, type: 'value-single', className: 'value-single'
      }, props.option), props.option.label
    )
  )
}

ValueSingle.propTypes = {
  option: PropTypes.object.isRequired,
  labelComponent: PropTypes.node
}

ValueSingle.defaultProps = {
  labelComponent: null
}

export default React.memo(ValueSingle)
