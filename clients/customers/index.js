'use strict';

const { io } = require('socket.io-client');
const socket = io('http://localhost:3001/candy');
const orderCreator = require('./handler');
// const store = 'Eva\'s Sugar & Reece\'s Pieces';

socket.emit('getAll', { queueId: 'customer' });
//!! EVERYTHING STARTS HERE AT THIS INTERVAL
setInterval(() => {
 
  orderCreator(socket);
}, 5000);

// customer responding to confirmation from orderHandler
// socket.on('confirmation', (payload) => {
//   console.log(`CUSTOMER: Thanks for confirming my order: ${payload.order.orderId}`);
// });


socket.on('confirmation', (payload) => {
  socket.emit('received', payload);
  console.log(`CUSTOMER: Thanks for confirming my order: ${payload.order.orderId}`);
  console.log(`CUSTOMER: Thanks driver! I got my order: ${payload.order.orderId}.`);
});



