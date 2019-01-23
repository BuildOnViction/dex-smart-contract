const fs = require('fs')
const path = require('path')

const exchangeFile = path.resolve(__dirname, '../', process.argv[2])
const exchangeContractFile = path.resolve(
    __dirname,
    '../build/contracts/Exchange.json',
)

const REG = /const\s+ExchangeBin\s*=\s*`([^`]*)`/

function processFile (file) {
  console.log('Processing :' + file)

  const content = fs.readFileSync(file).toString()
    // const matches = content.match(/const\s+ExchangeBin\s*=\s*`([^`]+)`/);
  const exchangeContractContent = fs.readFileSync(exchangeContractFile)
  const bytecode = JSON.parse(exchangeContractContent).bytecode

  const newContent = content.replace(
        REG,
        'const ExchangeBin = `' + bytecode + '`',
    )
  console.log('Writing:' + file)
  fs.writeFileSync(file, newContent)
}

processFile(exchangeFile)
