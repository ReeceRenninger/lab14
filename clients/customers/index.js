'use strict';

const { io } = require('socket.io-client');
const socket = io('http://localhost:3001/candy');
const store = 'Eva\'s Sugar & Reece\'s Pieces';

setInterval(() => {
  
  socket.emit('order', store );
}, 5000);

// customer responding to confirmation from orderHandler
socket.on('confirmation', console.log(`CUSTOMER: Thanks for confirming my order of ${payload} from ${store}`));

socket.on('delivered', console.log(`CUSTOMER: Thanks driver! I got my order from ${store}.`));



