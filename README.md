# Reax Select ✨
### Select input for react component

➡️ How to install and basic usage of 'reax-select'
* install via npm
```terminal
$ npm i reax-select
```
* install via yarn
```terminal
$ yarn add reax-select
```
* basic usage example
```js
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
        isSearchable
        value={selectSingle}
        options={options}
        onChange={val => setSelectSingle(val)}
        placeholder="select your favorite brand car..."
      />
      <br />
      <Select
        isMulti
        keepSearchOnBlur
        isSearchable
        value={selectMulti}
        options={options}
        onChange={val => setSelectMulti(val)}
        placeholder="select your favorites brand car..."
      />
    </>
  )
}
```
---
#### Credits:
* ⚛️ [reactjs](https://reactjs.org/)
* 💅 [styled-components](https://www.styled-components.com/)
---
Contributor:
- [Elisha Limanu](https://github.com/elishaenu)
---
&copy; 2019 Ahmad Aidil
