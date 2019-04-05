import React from 'react'
import Select from 'reax-select'

const options = [
  { label: 'Volvo', value: 'volvo' },
  { label: 'Saab', value: 'saab' },
  { label: 'Mercedes', value: 'mercedes' },
  { label: 'Audi', value: 'audi' }
]

export default function App() {
  const [selectVal, setSelectVal] = React.useState('')

  return (
    <Select
      value={selectVal}
      options={options}
      onChange={e => setSelectVal(e.target.value)}
    />
  )
}
