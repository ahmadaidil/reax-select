import React from 'react'
import PropTypes from 'prop-types'
import List from 'react-virtualized/dist/commonjs/List'
import SelectLabel from './label'
import { isArray, equal } from './utils'
import OptionComponent from './option'

import MenuContainer from './menuContainer'

export default class Menu extends React.PureComponent {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    options: PropTypes.array.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
      PropTypes.object
    ]).isRequired,
    error: PropTypes.bool.isRequired,
    search: PropTypes.string,
    selectedIndex: PropTypes.number,
    menuComponent: PropTypes.node,
    labelComponent: PropTypes.node,
    optionComponent: PropTypes.node,
    emptyText: PropTypes.string.isRequired,
    rowHeight: PropTypes.number.isRequired,
    onSelect: PropTypes.func.isRequired
  }

  static defaultProps = {
    search: '',
    selectedIndex: 0,
    menuComponent: null,
    labelComponent: null,
    optionComponent: null
  }

  constructor(props) {
    super(props)
    this.state = {}
    this.list = React.createRef()
  }

  componentDidUpdate(prevProps) {
    const { search, emptyText, options } = this.props
    const { current: list } = this.list
    if (list) {
      if (search !== prevProps.search || emptyText !== prevProps.emptyText || options !== prevProps.options) {
        list.forceUpdateGrid()
      }
    }
  }

  onSelect = (value, option) => {
    if (isArray(this.props.value)) {
      const found = this.props.value.some(item => item === value)
      let values
      if (found) {
        values = this.props.value.filter(item => item !== value)
      } else {
        values = Array.from(new Set([...this.props.value, value]))
      }
      this.props.onSelect(values, option)
    } else {
      this.props.onSelect(value, option)
    }
  }

  onRect = rect => {
    this.setState({ rect })
  }

  rowRenderer = ({ key, index, style }) => {
    const {
      options = [], labelComponent, selectedIndex, optionComponent, rowHeight, search
    } = this.props
    const option = options[index]
    const currentValue = isArray(this.props.value)
      ? this.props.value
      : [this.props.value]
    const Component = optionComponent || OptionComponent

    return (React.createElement('div', { key, style },
      React.createElement(Component, {
        option, labelComponent, height: rowHeight, active: currentValue.some(val => equal(val, option.value)), selected: selectedIndex === index, search, onSelect: this.onSelect
      })))
  }

  emptyRenderer = () => {
    const { Empty } = Menu

    return React.createElement(Empty, { emptyText: this.props.emptyText })
  }

  render() {
    const {
      open, options = [], selectedIndex, error
    } = this.props
    const { rect } = this.state
    const MenuContent = this.props.menuComponent
    const rowHeight = this.props.rowHeight || 32
    const menuHeight = 185
    const height = Math.min(Math.max(options.length * rowHeight, rowHeight), menuHeight)

    return open ? (React.createElement(MenuContainer, { error, menuHeight: height, onRect: this.onRect }, MenuContent ? (React.createElement(MenuContent, Object.assign({}, this.props))) : (React.createElement(List, {
      className: 'reax-select-menu-list', ref: this.list, width: rect ? rect.width : 0, height, rowHeight, rowCount: options.length, rowRenderer: this.rowRenderer, scrollToIndex: selectedIndex, noRowsRenderer: this.emptyRenderer
    })))) : null
  }
}

const Empty = props => (React.createElement(OptionComponent.OptionItem, null,
  React.createElement(SelectLabel, null,
    React.createElement('i', null, props.emptyText))))

Empty.propTypes = {
  emptyText: PropTypes.string
}

Empty.defaultProps = {
  emptyText: 'No results'
}

Menu.Empty = Empty
