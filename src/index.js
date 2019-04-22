import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Value } from './value'
import Menu from './menu'
import MenuContainer from './menuContainer'
import {
  isArray, keys, getDocument, getValueOptions, equal, toKey
} from './utils'
import './styling'

export default class Select extends React.PureComponent {
  static propTypes = {
    creatable: PropTypes.bool,
    clearable: PropTypes.bool,
    searchable: PropTypes.bool,
    disabled: PropTypes.bool,
    error: PropTypes.bool,
    multi: PropTypes.bool,
    native: PropTypes.bool,
    keepSearchOnBlur: PropTypes.bool,
    options: PropTypes.array,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
      PropTypes.object
    ]).isRequired,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    emptyText: PropTypes.string,
    'data-role': PropTypes.string,
    rowHeight: PropTypes.number,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    onCreate: PropTypes.func,
    onCreateText: PropTypes.func,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    onSearch: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    menuComponent: PropTypes.node,
    labelComponent: PropTypes.node,
    optionComponent: PropTypes.node,
    valueComponentSingle: PropTypes.node,
    valueComponentMulti: PropTypes.node,
    arrowComponent: PropTypes.node,
    clearComponent: PropTypes.node
  }

  static defaultProps = {
    creatable: false,
    clearable: false,
    searchable: false,
    disabled: false,
    error: false,
    multi: false,
    native: false,
    keepSearchOnBlur: false,
    options: [],
    placeholder: 'Select...',
    className: '',
    emptyText: 'No results',
    'data-role': '',
    rowHeight: 0,
    children: null,
    onCreate: value => value,
    onCreateText: value => value,
    onOpen: () => {},
    onClose: () => {},
    onSearch: value => value,
    menuComponent: null,
    labelComponent: null,
    optionComponent: null,
    valueComponentSingle: null,
    valueComponentMulti: null,
    arrowComponent: null,
    clearComponent: null
  }

  constructor(props) {
    super(props)
    this.document = getDocument()
    this.container = null
    this.nativeSelect = React.createRef()
    this.state = {
      open: false,
      search: '',
      selectedIndex: 0,
      blindText: '',
      focused: false
    }
  }

  componentDidUpdate(_, prevState) {
    if (this.state.blindText && prevState.blindText !== this.state.blindText) {
      this.handleBlindTextUpdate()
    }
  }

  componentWillUnmount() {
    this.removeDocumentListener()
  }

  onChangeNativeSelect(e) {
    const { onChange, multi } = this.props
    const { currentTarget } = e
    if (onChange) {
      if (currentTarget.value === '') {
        this.onClear()
      } else {
        const values = Array.from(currentTarget.selectedOptions).map(htmlOption => this.options[htmlOption.index - 1].value)
        if (multi) {
          onChange(values)
        } else {
          onChange(values[0])
        }
      }
    }
  }

  get options() {
    const { search } = this.state
    const { creatable, onCreateText } = this.props
    let options = this.props.options || []
    const showCreate = creatable && !options.some(option => option.value === search)
    if (search) {
      options = options.filter(option => option.label.toLowerCase().includes(search.toLowerCase()))
    }
    if (showCreate && search) {
      options = [
        {
          label: onCreateText
            ? onCreateText(search)
            : `Create "${search}"`,
          value: search,
          creatable: true
        },
        ...options
      ]
    }

    return options
  }

  toggleMenu = () => {
    const open = !this.state.open
    if (open) {
      this.openMenu()
    } else {
      this.closeMenu()
    }
  }

  onSearchFocus = () => {
    const { open, focused } = this.state
    if (!open && !focused && !this.props.native) {
      this.openMenu()
    }
    this.setState({ focused: true })
  }

  onSearchBlur = () => {
    this.setState({ focused: false })
  }

  onOptionSelect = (value, option) => {
    const { current } = this.nativeSelect
    const { onChange, creatable } = this.props
    let optionWasCreated = false
    const selectOnNative = () => {
      if (current) {
        current.value = isArray(value)
          ? value.map(this.findOptionIndex)
          : this.findOptionIndex(value)
      }
      this.setState({ focused: true }, () => this.closeMenu(() => onChange && onChange(value, option)))
    }
    if (creatable) {
      const createValue = val => {
        const option = this.options.find(option => this.optionIsCreatable(option) && option.value === val)
        if (option) {
          optionWasCreated = true
          this.createOption(option.value, selectOnNative)
        }
      }
      if (isArray(value)) {
        value.map(createValue)
      } else {
        createValue(value)
      }
    }
    if (!optionWasCreated) {
      selectOnNative()
    }
  }

  onOptionRemove = value => {
    if (isArray(this.props.value)) {
      const values = this.props.value.filter(val => !equal(val, value))
      this.onOptionSelect(values)
    }
  }

  onClear = () => {
    this.onOptionSelect(this.props.multi ? [] : undefined)
  }

  onSearch = search => {
    this.setState({ search }, () => {
      if (this.options.length === 1 || (this.props.creatable && search)) {
        this.setState({ selectedIndex: 0 })
      } else {
        this.setState({ selectedIndex: undefined })
      }
      if (this.props.onSearch) {
        this.props.onSearch(search)
      }
    })
  }

  onDocumentClick = e => {
    const { target } = e
    if (target.closest('.reax-select-menu')) {
      return
    }
    if (this.container && !this.container.contains(target)) {
      this.closeMenu()
    }
  }

  onKeyDown = ({ keyCode }) => {
    const { searchable, creatable } = this.props
    switch (keyCode) {
      case keys.TAB:
        if (this.state.open) {
          this.closeMenu()
        }
        break
      default:
        break
    }

    if (!searchable && !creatable) {
      this.handleBlindText(keyCode)
    }
  }

  onKeyUp = ({ keyCode }) => {
    const { search, open } = this.state
    const { value } = this.props
    let { selectedIndex } = this.state
    switch (keyCode) {
      case keys.ARROW_UP:
        if (open) {
          if (selectedIndex !== undefined) {
            selectedIndex -= 1
            if (selectedIndex < 0) {
              selectedIndex = this.options.length - 1
            }
          }
          this.setState({ selectedIndex })
        } else {
          this.openMenu()
        }
        break
      case keys.ARROW_DOWN:
        if (open) {
          if (selectedIndex === undefined || selectedIndex === this.options.length - 1) {
            selectedIndex = 0
          } else {
            selectedIndex += 1
          }
          this.setState({ selectedIndex })
        } else {
          this.openMenu()
        }
        break
      case keys.ENTER:
        if (this.state.selectedIndex === 0 && this.optionIsCreatable(this.options[0])) {
          this.createOption(search)
        } else if (selectedIndex !== undefined && this.options[selectedIndex]) {
          const newValue = this.options[selectedIndex].value
          this.onOptionSelect(isArray(value) ? [...value, newValue] : newValue)
        }
        break
      case keys.ESC:
        if (open) {
          this.closeMenu()
        }
        break
      default:
        break
    }
  }

  handleBlindText = keyCode => {
    const { blindText } = this.state
    if (keyCode === keys.BACKSPACE && blindText.length) {
      clearTimeout(this.blindTextTimeout)
      this.setState({
        blindText: blindText.slice(0, blindText.length - 1)
      }, this.cleanBlindText)
    } else if (keyCode === keys.SPACE) {
      clearTimeout(this.blindTextTimeout)
      this.setState({
        blindText: `${blindText} `
      }, this.cleanBlindText)
    } else {
      const key = String.fromCodePoint(keyCode)
      if (/\w/.test(key)) {
        clearTimeout(this.blindTextTimeout)
        this.setState({
          blindText: blindText + key
        }, this.cleanBlindText)
      }
    }
  }

  onContainerRef = el => {
    this.container = el
  }

  handleBlindTextUpdate = () => {
    const { open, blindText } = this.state
    const { multi } = this.props
    if (open) {
      const selectedIndex = this.options.findIndex(option => option.label.toLowerCase().startsWith(blindText.toLowerCase()))
      if (selectedIndex >= 0) {
        this.setState({ selectedIndex })
      }
    } else if (!multi) {
      if (blindText) {
        const option = this.options.find(option => option.label
          .toLowerCase()
          .startsWith(blindText.toLowerCase()))
        if (option) {
          this.onOptionSelect(option.value)
        }
      } else {
        this.onOptionSelect(undefined)
      }
    }
  }

  openMenu = () => {
    const selectedIndex = this.options.findIndex(option => equal(option.value, this.props.value))
    const keepSearchOnBlur = this.props.keepSearchOnBlur && !this.props.value
    this.setState(prevState => ({
      open: true,
      search: keepSearchOnBlur ? prevState.search : undefined,
      selectedIndex
    }), () => {
      if (this.props.onOpen) {
        this.props.onOpen()
      }
      this.addDocumentListener()
    })
  }

  closeMenu = (callback = () => { }) => {
    const keepSearchOnBlur = this.props.keepSearchOnBlur && !this.props.value
    this.removeDocumentListener()
    this.setState(prevState => ({
      open: false,
      search: keepSearchOnBlur ? prevState.search : undefined,
      selectedIndex: undefined
    }), () => {
      if (this.props.onClose) {
        this.props.onClose()
      }
      callback()
    })
  }

  createOption = (value, cb) => {
    const { onCreate } = this.props
    if (onCreate) {
      this.closeMenu(() => {
        onCreate(value)
        if (cb) {
          cb()
        }
      })
    }
  }

  addDocumentListener = () => {
    this.removeDocumentListener()
    if (this.document) {
      this.document.addEventListener('click', this.onDocumentClick)
    }
  }

  removeDocumentListener = () => {
    if (this.document) {
      this.document.removeEventListener('click', this.onDocumentClick)
    }
  }

  cleanBlindText = () => {
    this.blindTextTimeout = setTimeout(() => this.setState({ blindText: '' }), 700)
  }

  findOptionIndex = val => {
    let index = this.options.findIndex(option => option.value === val)
    if (index === -1) {
      if (typeof val === 'object') {
        index = this.options.findIndex(option => {
          if (typeof option.value === 'object') {
            return (JSON.stringify(option.value) === JSON.stringify(val))
          }

          return false
        })
      }
      if (index === -1) {
        return ''
      }
    }

    return String(index)
  }

  optionIsCreatable(option) {
    return (this.props.creatable && option.creatable && Boolean(this.props.onCreate && this.state.search))
  }

  renderNativeSelect = () => {
    const { NativeSelect } = Select
    const {
      native, placeholder, multi, disabled
    } = this.props
    const dataRole = this.props['data-role']
      ? `select-${this.props['data-role']}`
      : undefined
    const clearable = this.props.clearable && native
    const value = isArray(this.props.value)
      ? this.props.value.map(this.findOptionIndex)
      : this.findOptionIndex(this.props.value || '')

    return (React.createElement(NativeSelect, {
      ref: this.nativeSelect, multiple: multi, value, disabled, native, tabIndex: -1, 'data-role': dataRole, onChange: this.onChangeNativeSelect
    },
    React.createElement('option', { value: '', disabled: !clearable }, placeholder),
    this.options.map((option, i) => (React.createElement('option', { key: toKey(option.value), value: `${i}`, disabled: option.disabled }, option.label)))))
  }

  renderChildren = () => {
    const {
      options, placeholder, multi, children
    } = this.props
    const { open, search } = this.state
    const valueOptions = getValueOptions(options || [], this.props.value)
    const value = !multi
      ? this.props.value
      : valueOptions.map(option => option.value)
    const showPlaceholder = !search && (isArray(value)
      ? value.length === 0
      : value === undefined || value === null)
    if (!children) {
      return null
    }

    return children({
      options: this.options,
      open,
      value,
      MenuContainer,
      placeholder: showPlaceholder ? placeholder : undefined,
      onToggle: () => this.toggleMenu(),
      onRef: ref => { this.container = ref }
    })
  }

  render() {
    const { Container } = Select
    const {
      className, options, creatable,
      clearable, placeholder, value,
      disabled, error, menuComponent,
      labelComponent, optionComponent,
      valueComponentSingle, valueComponentMulti,
      arrowComponent, clearComponent, multi,
      native, emptyText, rowHeight, keepSearchOnBlur
    } = this.props
    const {
      open, search, selectedIndex, focused
    } = this.state
    const searchable = this.props.searchable || creatable
    if (this.props.children) {
      return this.renderChildren()
    }
    const classNames = [
      'reax-select',
      className,
      error && 'has-error'
    ].filter(c => Boolean(c))

    return (React.createElement(Container, {
      className: classNames.join(' '), disabled, ref: this.onContainerRef, 'data-role': this.props['data-role'], onKeyUp: this.onKeyUp, onKeyDown: this.onKeyDown
    },
    this.renderNativeSelect(),
    React.createElement(Value, {
      clearable, searchable, open, disabled, multi, mobile: native, focused, options, placeholder, error, value, search, keepSearchOnBlur, labelComponent, valueComponentSingle, valueComponentMulti, arrowComponent, clearComponent, onClear: this.onClear, onClick: this.toggleMenu, onSearch: this.onSearch, onSearchFocus: this.onSearchFocus, onSearchBlur: this.onSearchBlur, onOptionRemove: this.onOptionRemove
    }),
    React.createElement(Menu, {
      open, options: this.options, value, error, search, selectedIndex, menuComponent, labelComponent, optionComponent, emptyText, rowHeight, onSelect: this.onOptionSelect
    })))
  }
}

Select.Container = styled.div`
  font: 400 14px 'Roboto', sans-serif;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.43;
  letter-spacing: 0.3px;
  display: flex;
  position: relative;
  cursor: default;
  width: 100%;
  box-sizing: border-box;
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
  opacity: ${props => (props.disabled ? '0.4' : '1')};
  user-select: none;
`

Select.NativeSelect = styled.select`
  display: block;
  z-index: ${props => (props.native ? '1' : 'auto')};
  opacity: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  height: 100%;
`
