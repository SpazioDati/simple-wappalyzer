'use strict'

const { noop, chain, mapValues } = require('lodash')
const { Cookie } = require('tough-cookie')
const jsdom = require('jsdom')

const { JSDOM, VirtualConsole } = jsdom

const parseCookie = str => Cookie.parse(str).toJSON()

const getCookies = str =>
  chain(str)
    .map(parseCookie)
    .map(({ key: name, ...props }) => ({ name, ...props }))
    .value()

const getHeaders = headers => mapValues(headers, value => [value])

const getScripts = scripts =>
  chain(scripts)
    .map('src')
    .compact()
    .uniq()
    .value()

const getLinks = links =>
  chain(links)
    .map('href')
    .compact()
    .uniq()
    .value()

function Browser ({ url, html, statusCode, headers }) {
  const userAgent = headers['user-agent']
  const contentType = headers['content-type']

  const { window } = new JSDOM(html, {
    url,
    runScripts: 'dangerously',
    virtualConsole: new VirtualConsole()
  })

  return {
    visit: noop,
    userAgent,
    cookies: getCookies(headers['set-cookie']),
    html,
    statusCode,
    contentType,
    document: window.document,
    window,
    headers: getHeaders(headers),
    js: window,
    scripts: getScripts(window.document.scripts),
    links: getLinks(window.document.getElementsByTagName('a'))
  }
}

module.exports = Browser
