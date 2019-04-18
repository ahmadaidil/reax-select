import React from 'react'
import { render } from 'react-dom'
import { createGlobalStyle } from 'styled-components'

const id = 'reax-select-style'
function create() {
  const ReaxSelectStyle = createGlobalStyle`
    .reax-select, .reax-select-menu {
      --reax-select-error-color: #d5474f; 
    }
  `
  const reaxSelectDiv = document.createElement('div')
  reaxSelectDiv.id = id
  document.body.appendChild(reaxSelectDiv)
  render(React.createElement(ReaxSelectStyle, null), reaxSelectDiv)
}

if (!document.getElementById(id)) {
  create()
}
