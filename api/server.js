// server için gerekli olanları burada ayarlayın

const express = require('express');
const postsRouter = require('./posts/posts-router');

const server = express();

server.use(express.json());


// posts router'ını buraya require edin ve bağlayın
server.use('/api/posts', postsRouter);

module.exports = server;