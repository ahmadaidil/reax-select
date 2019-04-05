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
  const [selectVal, setSelectVal] = React.useState('')

  return (
    <Select
      value={selectVal}
      options={options}
      onChange={e => setSelectVal(e.target.value)}
      placeholder="select your favorite brand car..."
    />
  )
}
```
---
#### Credits:
* ⚛️ [reactjs](https://reactjs.org/)
* 💅 [styled-components](https://www.styled-components.com/)
---
&copy; 2019 Ahmad Aidil
