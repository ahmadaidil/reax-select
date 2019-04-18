import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

export default class Remove extends React.PureComponent {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired
  }

  onClick = e => {
    e.stopPropagation()
    this.props.onClick(this.props.value)
  }

  render() {
    const { StyledRemove } = Remove

    return (React.createElement(StyledRemove, {
      className: 'remove', type: 'button', tabIndex: -1, onClick: this.onClick
    }, '\u00D7'))
  }
}

Remove.StyledRemove = styled.button`
  width: 16px;
  height: 16px;
  cursor: pointer;
  color: #1b1c21;
  border: none;
  background: #9ea1b4;
  padding: 2px 4px;
  margin: 0;
  line-height: 1;
  display: inline-block;
  border-radius: 20px;
  margin-left: 8px;
  font-size: 12px;
  &:hover {
    background-color: #ffd77b;
  }
  &:focus {
    outline: none;
  }
`
