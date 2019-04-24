const { readFile, writeFile } = require('./fileSync')

const packageJson = readFile('scripts/package-tmp.json')
writeFile('package.json', packageJson)
