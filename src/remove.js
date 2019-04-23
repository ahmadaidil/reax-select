import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import CloseCircleIcon from 'volantis-icon/dist/icons/CloseCircle'

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

    return (
      React.createElement(StyledRemove, null, React.createElement(CloseCircleIcon, {
        width: '16px', height: '16px', isHover: true, onClick: this.onClick
      }))
    )
  }
}

Remove.StyledRemove = styled.div`
  display: flex;
  align-items: center;
  margin-left: 4px;
`
