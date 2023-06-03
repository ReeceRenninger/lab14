'use strict';

const { io } = require('socket.io-client');
const socket = io('http://localhost:3001/candy');
const { thankCustomer, confirmOrder } = require('./handler');
const store = 'Eva\'s Sugar & Reece\'s Pieces';

socket.emit('join', store);
socket.emit('getAll', { queueId: store });

// on order creation, vendor will confirm order.
socket.on('customerOrder', confirmOrder(socket)); 

socket.on('delivered', (payload) => {
  setTimeout(() => {
    socket.emit('received', payload);
    thankCustomer(payload);
  }, 1000);
});