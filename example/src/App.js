import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { VolantisIcon } from 'volantis-icon'
import Select from 'reax-select'

const options = [
  { label: 'Volvo', value: 'volvo' },
  { label: 'Saab', value: 'saab' },
  { label: 'Mercedes', value: 'mercedes' },
  { label: 'Audi', value: 'audi' }
]

function labelComponent(props) {
  const Label = styled.div`
    display: flex;
    align-items: center;
    svg {
      margin-right: .5rem;
    }
  `

  return (
    <Label>
      <VolantisIcon height="20" width="20" color="#93a1b4" />
      {props.children}
    </Label>
  )
}

labelComponent.propTypes = {
  children: PropTypes.node.isRequired
}

export default function App() {
  const [selectSingle, setSelectSingle] = React.useState({})
  const [selectMulti, setSelectMulti] = React.useState([])

  return (
    <>
      <Select
        searchable
        value={selectSingle}
        options={options}
        onChange={val => setSelectSingle(val)}
        placeholder="select your favorite brand car..."
      />
      <br />
      <Select
        multi
        keepSearchOnBlur
        searchable
        value={selectMulti}
        options={options}
        onChange={val => setSelectMulti(val)}
        placeholder="select your favorites brand car... (multi)"
      />
      <br />
      <Select
        searchable
        value={selectSingle}
        options={options}
        onChange={val => setSelectSingle(val)}
        placeholder="select your favorite brand car... (with icon label option)"
        labelComponent={labelComponent}
      />
    </>
  )
}
