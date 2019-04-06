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
  cursor: pointer;
  color: #007eff;
  border: none;
  background: none;
  padding: 2px 4px;
  margin: 0;
  margin-right: 4px;
  line-height: 1;
  display: inline-block;
  border-right: 1px solid rgba(0, 126, 255, 0.24);
  margin-left: -2px;
  font-size: 13px;
  &:hover {
    background-color: rgba(0, 113, 230, 0.08);
  }
  &:focus {
    outline: none;
  }
`
