const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/phaser.min.js', express.static(path.join(__dirname, '..', 'node_modules', 'phaser', 'dist', 'phaser.min.js')))
app.use('/uuidv4.min.js', express.static(path.join(__dirname, '..', 'node_modules', 'uuid', 'dist', 'umd', 'uuidv4.min.js')))
app.use(express.static(path.join(__dirname, '..', 'public')))

module.exports = app
