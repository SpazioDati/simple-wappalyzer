'use strict'

const writeJsonFile = require('write-json-file')
const got = require('got')

const fetchTechnologies = async () => {
  const chars = Array.from({ length: 27 }, (value, index) =>
    index ? String.fromCharCode(index + 96) : '_'
  )

  const data = await Promise.all(
    chars.map(char =>
      got(
        `https://raw.githubusercontent.com/wappalyzer/wappalyzer/master/src/technologies/${char}.json`
      ).json()
    )
  )

  const technologies = data.reduce(
    (acc, obj) => ({
      ...acc,
      ...obj
    }),
    {}
  )

  return writeJsonFile('src/technologies.json', technologies)
}

const fetchCategories = async () => {
  const categories = await got(
    'https://raw.githubusercontent.com/wappalyzer/wappalyzer/master/src/categories.json'
  ).json()

  return writeJsonFile('src/categories.json', categories)
}

Promise.all([fetchTechnologies(), fetchCategories()])
  .catch(err => console.error(err) && process.exit(0))
  .then(process.exit)
