'use strict';

const { io } = require('socket.io-client');
const socket = io('http://localhost:3001/candy');
const { orderHandler, thankDriver } = require('./handler');
const store = '1-206-flowers';

socket.emit('join', store);
socket.emit('getAll', { queueId: store });

socket.on('order', orderHandler(socket));


socket.on('delivered', (payload) => {
  setTimeout(() => {
    socket.emit('received', payload);
    thankDriver(payload);
  }, 1000);
});