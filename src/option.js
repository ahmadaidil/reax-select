import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import SelectLabel from './label'

export default class OptionComponent extends React.PureComponent {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    selected: PropTypes.bool.isRequired,
    option: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    height: PropTypes.number.isRequired,
    labelComponent: PropTypes.node
  }

  static defaultProps = {
    labelComponent: null
  }

  onClick = () => {
    this.props.onSelect(this.props.option.value, this.props.option)
  }

  render() {
    const { OptionItem } = OptionComponent
    const {
      active, selected, labelComponent, option, height
    } = this.props
    const Label = (labelComponent || SelectLabel)
    const className = [
      'option',
      selected ? 'selected' : null,
      active ? 'active' : null
    ].filter(v => Boolean(v))

    return (React.createElement(OptionItem, {
      className: className.join(' '), selected, active, height, onClick: this.onClick
    },
    React.createElement(Label, Object.assign({ type: 'option', active }, option), option.label)))
  }
}

OptionComponent.OptionItem = styled.div`
  font: 400 14px 'Roboto', sans-serif;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  height: ${props => props.height || 32}px;
  padding: 0 10px;
  min-width: 0;
  cursor: pointer;
  box-sizing: border-box;
  color: #fff;
  background-color: ${props => (props.active ? '#313440' : props.selected ? '#313440' : '#454958')};

  &:hover {
    background-color: #313440;
  }
`
