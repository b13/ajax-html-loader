"use strict"

express = require "express"
bodyParser = require "body-parser"
TableDataProvider = require "./tableDataProvider"
tableDataProvider = new TableDataProvider()

console.log TableDataProvider

server  = module.exports = express()
port    = process.env.PORT or 7777

server.use(bodyParser.urlencoded({ extended: true }));
server.use '/', express.static process.env.DIRECTORY
server.use '/tabledata/', tableDataProvider.sendTableData

server.listen port, () ->
  console.log 'Started up test server on port ' + port