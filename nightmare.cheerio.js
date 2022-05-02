const Nightmare = require('C:/windows/system32/node_modules/nightmare')
const nightmare = Nightmare({ show: true })
const cheerio = require('cheerio');
const fs = require ('fs')
const xlsx = require ('node-xlsx')


nightmare
  .goto('https://ptax.bcb.gov.br/ptax_internet/consultaBoletim.do?method=exibeFormularioConsultaBoletim')
  // .type('#type', 'submit')
  .click('input[type=submit]')
  .wait('table.tabela')
  .evaluate(() => document.querySelector('html').innerHTML)
  .end()
  .then((html) => {
    // console.log({html})
    const $ = cheerio.load(html)
    const table = Array.from($("table.tabela tbody tr"))
    console.log("table; ", table)
    const regex = />.*</gim
    const data = table.slice(2).map((tr, i) => {
      const dataTR = $(tr)
      .html()
      .match(regex)
      .map(str => str.replace(/>|<|&nbsp;/gim, ""))
      // const tds = tr.children
      // console.log({tds})
      return dataTR
    }).reverse().slice(1).reverse()

    console.log({data})
    const buffer = xlsx.build([{name: 'mySheetName', data: data}]);
    fs.writeFileSync(`./DOLINHA.xlsx`, buffer)

    // console.log("LINHAS; ", $.html().replace(/\s/gim, ""))

  })
  .catch(error => {
    console.error('Search failed:', error)
  })