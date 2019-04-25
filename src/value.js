import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ArrowDropupIcon from 'volantis-icon/dist/icons/ArrowDropup'
import ArrowDropdownIcon from 'volantis-icon/dist/icons/ArrowDropdown'
import Label from './label'
import {
  keys, getValueOptions, getWindow, toKey
} from './utils'
import ValueSingle from './valueSingle'
import ValueMulti from './valueMulti'

const Button = styled.button`
  background: transparent;
  border: none;
  margin: 0;
  font-size: 20px;
  padding: 0;
  line-height: 1;
  cursor: pointer;
  &:focus {
    outline: none;
  }
`

const ArrowStyled = styled.div`
  display: flex;
  align-items: center;
`

const ValueContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  min-height: 32px;
  pointer-events: ${props => (props.mobile || props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${props => (props.disabled ? '0.4' : '1')};
  padding-left: 8px;
  background: #454958;
  cursor: default;
  border-width: 1px;
  border-style: solid;
  border-color: ${props => (props.isError ? 'var(--reax-select-error-color)' : '#1b1c21')};
  border-radius: ${props => (props.open ? '4px 4px 0 0' : '4px')};
  z-index: 0;
  box-sizing: border-box;
  max-width: 100%;
  box-shadow: ${props => (props.focused ? 'rgba(0, 0, 0, 0.15) 0 0 2px' : 'none')};
  color: #fff;
`

const ValueLeft = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  flex-wrap: ${props => (props.isMulti && props.hasValue ? 'wrap' : 'nowrap')};
  user-select: none;
  min-width: 0;
  box-sizing: border-box;
`

const ValueRight = styled.div`
  display: flex;
  align-items: center;
  margin-left: 4px;
  box-sizing: border-box;
`

const Placeholder = styled(Label)`
  color: #fff;
  opacity: 0.6;
`

const ClearButton = styled(Button)`
  margin-right: 6px;
`

const ClearContainer = styled.span`
  color: #ccc;
  &:hover {
    color: #333;
  }
`

const ClearX = () => React.createElement(ClearContainer, null, '\u00D7')

const Search = styled.span`
  min-width: 1px;
  margin-left: -1px;
  height: 16px;
  opacity: ${props => (props.canSearch ? 1 : 0)};
  user-select: text;
  position: ${props => (props.canSearch ? 'static' : 'absolute')};
  &:focus {
    outline: none;
  }
`

export class Value extends React.PureComponent {
  static propTypes = {
    isClearable: PropTypes.bool.isRequired,
    isSearchable: PropTypes.bool.isRequired,
    open: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired,
    isMulti: PropTypes.bool.isRequired,
    mobile: PropTypes.bool.isRequired,
    focused: PropTypes.bool.isRequired,
    options: PropTypes.array.isRequired,
    placeholder: PropTypes.string.isRequired,
    isError: PropTypes.bool.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
      PropTypes.object
    ]).isRequired,
    search: PropTypes.string,
    keepSearchOnBlur: PropTypes.bool.isRequired,
    labelComponent: PropTypes.node,
    valueComponentSingle: PropTypes.node,
    valueComponentMulti: PropTypes.node,
    arrowComponent: PropTypes.node,
    clearComponent: PropTypes.node,
    onClear: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    onSearchFocus: PropTypes.func.isRequired,
    onSearchBlur: PropTypes.func.isRequired,
    onOptionRemove: PropTypes.func.isRequired
  }

  static defaultProps = {
    search: '',
    labelComponent: null,
    valueComponentSingle: null,
    valueComponentMulti: null,
    arrowComponent: null,
    clearComponent: null
  }

  constructor(props) {
    super(props)
    this.search = React.createRef()
    const window = getWindow()
    if (window) {
      window.addEventListener('blur', this.blur)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.search && !this.props.search && this.search.current) {
      this.search.current.innerText = ''
    }
    if (prevProps.focused !== this.props.focused && this.props.focused) {
      this.focus()
    }
  }

  onClick = () => {
    if (!this.props.disabled) {
      this.focus()
      this.props.onClick()
    }
  }

  onClear(e) {
    e.stopPropagation()
    this.props.onClear()
  }

  onSearch = e => {
    if (this.props.isSearchable) {
      this.props.onSearch(e.currentTarget.innerText.trim())
    } else {
      e.preventDefault()
    }
  }

  onKeyDown = e => {
    const { isSearchable } = this.props
    if (e.metaKey) {
      return
    }
    if ((!isSearchable && e.keyCode !== keys.TAB) || e.keyCode === keys.ENTER || e.keyCode === keys.ARROW_UP || e.keyCode === keys.ARROW_DOWN) {
      e.preventDefault()
    }
  }

  focus = () => {
    const el = this.search.current
    if (el) {
      el.focus()
      if (typeof window.getSelection !== 'undefined' && typeof document.createRange !== 'undefined') {
        const range = document.createRange()
        const sel = window.getSelection()
        range.selectNodeContents(el)
        range.collapse(false)
        sel.removeAllRanges()
        sel.addRange(range)
      }
    }
  }

  blur = () => {
    if (this.search.current) {
      this.search.current.blur()
    }
  }

  renderSearch() {
    const {
      open, value, disabled, isSearchable, keepSearchOnBlur, onSearchFocus, onSearchBlur
    } = this.props
    const canSearch = (open && isSearchable) || (keepSearchOnBlur && !value && isSearchable)
    if (disabled && !keepSearchOnBlur) {
      return null
    }

    return (React.createElement(Search, {
      className: 'search', contentEditable: true, canSearch, onInput: this.onSearch, onKeyDown: this.onKeyDown, onFocus: onSearchFocus, onBlur: onSearchBlur, ref: this.search
    }))
  }

  renderValues(valueOptions) {
    const {
      placeholder, search, labelComponent, valueComponentSingle, valueComponentMulti, isMulti
    } = this.props
    if (search && !isMulti) {
      return null
    }
    if (valueOptions.length === 0 && !search) {
      return React.createElement(Placeholder, null, placeholder)
    }
    const Single = valueComponentSingle || ValueSingle
    const Multi = (valueComponentMulti || ValueMulti)

    return valueOptions.map(option => (isMulti ? (React.createElement(Multi, {
      key: toKey(option.value), option, labelComponent, options: valueOptions, onRemove: this.props.onOptionRemove
    })) : (React.createElement(Single, { key: toKey(option.value), option, labelComponent }))))
  }

  render() {
    const {
      options = [], value, disabled, isClearable, open, mobile, isMulti, focused, isError
    } = this.props
    const ArrowComponent = this.props.arrowComponent
    const ClearComponent = this.props.clearComponent || ClearX
    const valueOptions = getValueOptions(options, value)
    const showClearer = Boolean(isClearable && valueOptions.length && !mobile)
    const searchAtStart = !isMulti || valueOptions.length === 0
    const searchAtEnd = isMulti && valueOptions.length > 0

    return (React.createElement(ValueContainer, {
      'data-role': 'value', className: 'reax-select-value', disabled, mobile, focused, isError, open, onClick: this.onClick
    },
    React.createElement(ValueLeft, { className: 'value-left', isMulti, hasValue: !!valueOptions.length },
      searchAtStart && this.renderSearch(),
      this.renderValues(valueOptions),
      searchAtEnd && this.renderSearch()),
    React.createElement(ValueRight, { className: 'value-right' },
      showClearer && (React.createElement(ClearButton, {
        type: 'button', tabIndex: -1, className: 'clearer', onClick: this.onClear
      },
      React.createElement(ClearComponent, null))),
      React.createElement(ArrowStyled, null, ArrowComponent ? (React.createElement(ArrowComponent, { open })) : open ? (<ArrowDropupIcon width="24px" height="24px" isHover />) : (<ArrowDropdownIcon width="24px" height="24px" isHover />)))))
  }
}
