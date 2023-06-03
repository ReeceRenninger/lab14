'use strict';

const { io } = require('socket.io-client');
const socket = io('http://localhost:3001/candy');
const store = 'Eva\'s Sugar & Reece\'s Pieces';

socket.emit('getAll', {queueId: store});

const  { pickupOccurred, packageDelivered } = require('./handler');

socket.on('pickup', (payload) => {
  setTimeout(() => {
    pickupOccurred(payload, socket);
  }, 1000);
  setTimeout(() => {
    packageDelivered(payload, socket);
  }, 2000);
  socket.emit('received', {queueId: 'driver', messageId: payload.messageId});
}); 