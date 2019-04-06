import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import LabelComponent from './label'
import Remove from './remove'

export default class ValueMulti extends React.PureComponent {
  static propTypes = {
    option: PropTypes.object.isRequired,
    labelComponent: PropTypes.node,
    onRemove: PropTypes.func.isRequired
  }

  static defaultProps = {
    labelComponent: null
  }

  render() {
    const { TagContainer } = ValueMulti
    const { option, labelComponent, onRemove } = this.props
    const Label = (labelComponent || LabelComponent)

    return (React.createElement(TagContainer, Object.assign({ className: 'value-multi' }, option),
      React.createElement(Remove, { value: option.value, onClick: onRemove }, '\u00D7'),
      React.createElement(Label, Object.assign({ type: 'value-multi', active: true }, option), option.label)))
  }
}

ValueMulti.TagContainer = styled.div`
  display: flex;
  padding: 0px 3px;
  background-color: rgba(0, 126, 255, 0.08);
  border-radius: 2px;
  border: 1px solid rgba(0, 126, 255, 0.24);
  color: #007eff;
  font-size: 0.9em;
  line-height: 1.4;
  margin: 2px 3px;
  align-items: center;
  &:last-of-type {
    margin-right: 5px;
  }
`
