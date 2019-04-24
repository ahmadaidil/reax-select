import React from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { getWindow, getDocument, getWindowInnerHeight } from './utils'

function menuPosition(props) {
  if (!props.rect || props.rect.top + props.rect.height + (props.menuHeight || 185) <= getWindowInnerHeight()) {
    return 'bottom'
  }

  return 'top'
}

function getContainerTop(props) {
  if (!props.rect) {
    return '0px'
  }
  switch (menuPosition(props)) {
    case 'top':
      return `${props.rect.top - (props.menuHeight || 186)}px`
    case 'bottom':
      return `${props.rect.top + props.rect.height - 1}px`
    default:
      return ''
  }
}

const MenuWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
`

const Container = styled.div.attrs(props => ({
  style: {
    top: getContainerTop(props),
    left: `${props.rect ? props.rect.left : 0}px`,
    width: `${props.rect ? props.menuWidth || props.rect.width : 0}px`
  }
}))`
  position: fixed;
  z-index: 9999;
  background: transparent;
  box-sizing: border-box;
  box-shadow: ${props => (menuPosition(props) === 'bottom'
    ? '0 2px 5px rgba(0, 0, 0, 0.1)'
    : '0 -2px 5px rgba(0, 0, 0, 0.1)')};

  .ReactVirtualized__List {
    border-width: 1px;
    border-style: solid;
    border-color: ${props => (props.isError ? 'var(--react-select-error-color)' : '#1b1c21')};
    border-radius: 0 0 4px 4px;
    background-color: transparent;
    &:focus {
      outline: none;
    }
  }
`

export default class MenuContainer extends React.PureComponent {
  static propTypes = {
    onRect: PropTypes.func.isRequired,
    menuWidth: PropTypes.number,
    menuHeight: PropTypes.number.isRequired,
    isError: PropTypes.bool.isRequired,
    onRef: PropTypes.func,
    onClick: PropTypes.func,
    children: PropTypes.node,
    className: PropTypes.string
  }

  static defaultProps = {
    menuWidth: 0,
    onRef: ref => ref,
    onClick: () => {},
    children: null,
    className: ''
  }

  constructor(props) {
    super(props)
    this.window = getWindow()
    this.document = getDocument()
    this.state = {}
  }

  componentDidMount() {
    this.addListener()
  }

  componentDidUpdate(_, prevState) {
    if (prevState.rect !== this.state.rect && this.props.onRect) {
      this.props.onRect(this.state.rect)
    }
  }

  componentWillUnmount() {
    this.removeListener()
  }

  onViewportChange = e => {
    if (this.allowRectChange(e)) {
      this.setState({ rect: this.rect })
    }
  }

  onEl = el => {
    this.el = el
    this.setState({
      rect: this.rect
    })
  }

  get rect() {
    if (this.el) {
      const clientRect = this.el.getBoundingClientRect()

      return {
        left: Math.round(clientRect.left),
        top: Math.round(clientRect.top),
        width: Math.round(clientRect.width),
        height: Math.round(clientRect.height)
      }
    }

    return undefined
  }

  allowRectChange = e => {
    if (e.target.closest && !e.target.closest('.reax-select-menu')) {
      return false
    }

    return true
  }

  addListener() {
    if (this.window) {
      this.window.addEventListener('scroll', this.onViewportChange, true)
      this.window.addEventListener('resize', this.onViewportChange, true)
    }
  }

  removeListener() {
    if (this.window) {
      this.window.removeEventListener('resize', this.onViewportChange, true)
      this.window.removeEventListener('scroll', this.onViewportChange, true)
    }
  }

  render() {
    const {
      menuWidth, menuHeight, isError, onRef, onClick, children
    } = this.props
    const className = ['react-select-menu', this.props.className]
      .filter(c => c)
      .join(' ')

    return (React.createElement(MenuWrapper, { ref: this.onEl }, this.document
      ? createPortal(React.createElement(Container, {
        'data-role': 'menu', className, isError, rect: this.state.rect, menuWidth, menuHeight, ref: onRef, onClick
      }, children), this.document.body)
      : null))
  }
}
