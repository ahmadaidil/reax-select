import React from 'react'
import Select from 'reax-select'

const options = [
  { label: 'Volvo', value: 'volvo' },
  { label: 'Saab', value: 'saab' },
  { label: 'Mercedes', value: 'mercedes' },
  { label: 'Audi', value: 'audi' }
]

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
        placeholder="select your favorites brand car..."
      />
    </>
  )
}
