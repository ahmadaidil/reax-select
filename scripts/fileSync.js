const fs = require('fs')

function createBeautifyJson(obj) {
  return JSON.stringify(obj, null, 2)
}

function readFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath).toString())
}

function writeFile(filePath, obj) {
  fs.writeFileSync(filePath, `${createBeautifyJson(obj)}\r\n`, {
    encoding: 'utf-8'
  })
}

module.exports = {
  readFile,
  writeFile
}
