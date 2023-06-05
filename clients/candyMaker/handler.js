'use strict';

// const { p } = require('chart.js/dist/chunks/helpers.core');
const { io } = require('socket.io-client');
const socket = io('http://localhost:3001/candy');


const confirmOrder = (payload) => {
  console.log('VENDOR: We have received your order:', payload.order.orderId);
  payload.event = 'pickup';
  socket.emit('pickup', payload);
};


const thankCustomer = (payload) => {
  console.log('VENDOR: Thank you for your candy order', payload.order.orderId);
  socket.emit('received', payload);
};

module.exports = { confirmOrder, thankCustomer };