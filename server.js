'use strict';

// dmhy 處理
const dmhy = require('./dmhy.js');

// express 設定
const express = require('express');
const app = express();
app.use(require('cors')());

app.get('/', dmhy.handleRequest);

app.listen(5566);