# Reax Select ✨
### Select input for react component

### 🔥 Development
➡️ How to install dependencies, build lib and start example app
* install deps 
```terminal
$ yarn
$ yarn example:install
```
* start example app
```terminal
$ yarn start
```
* release to npm
```terminal
$ yarn release
```
---
### ✨ Production

➡️ How to install and use 'reax-select'
* install using npm
```terminal
$ npm i reax-select
```
* install using yarn
```terminal
$ yarn add reax-select
```
* example use
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
&copy; 2019 Ahmad Aidil
