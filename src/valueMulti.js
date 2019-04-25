import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import LabelComponent from './label'
import Remove from './remove'

export default class ValueMulti extends React.PureComponent {
  static propTypes = {
    option: PropTypes.object.isRequired,
    labelComponent: PropTypes.any,
    onRemove: PropTypes.func.isRequired
  }

  static defaultProps = {
    labelComponent: null
  }

  render() {
    const { TagContainer } = ValueMulti
    const { option, labelComponent, onRemove } = this.props
    const Label = (labelComponent || LabelComponent)

    return (
      React.createElement(
        TagContainer, Object.assign({ className: 'value-multi' }, option),
        React.createElement(Label, Object.assign({ type: 'value-multi', active: true }, option), option.label),
        React.createElement(Remove, { value: option.value, onClick: onRemove }, null)
      )
    )
  }
}

ValueMulti.TagContainer = styled.div`
  display: flex;
  padding: 4px 8px 4px 12px;
  background-color: #1b1c21;
  border-radius: 20px;
  color: #fff;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.4;
  margin: 3px 4px;
  align-items: center;
  &:last-of-type {
    margin-right: 5px;
  }
`
