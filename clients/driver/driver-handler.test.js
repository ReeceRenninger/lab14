'use strict';

let socket = require('../socket-client.js');
const { io } = require('socket.io-client');
const { pickupOccurred, packageDelivered } = require('./handler');

jest.mock('../socket-client.js', () => {
  return {
    on: jest.fn(),
    emit: jest.fn(),
  };
});

let consoleSpy;

beforeAll(() => {
  consoleSpy = jest.spyOn(console, 'log').mockImplementation();
});

afterAll(() => {
  consoleSpy.mockRestore();
});

describe('Testing driver handlers', () => {

  test('Should log and emit in-transit after pick up occurs', () => {
    let payload = { order: {orderId: 12345} };
    pickupOccurred(payload, socket);

    expect(socket.emit).toHaveBeenCalledWith('in-transit', payload);
    expect(consoleSpy).toHaveBeenCalledWith('DRIVER: picked up', payload.order.orderId);
  });


  test('should emit delivered and log Driver delivery ', () => {
    let payload = { 
      event: 'delivered',
      order: {orderId: 12345},
    };
    packageDelivered(payload, socket);

    expect(socket.emit).toHaveBeenCalledWith('confirmation', {...payload, event: 'confirmation'});
    expect(consoleSpy).toHaveBeenCalledWith('DRIVER: delivery confirmation', payload.order.orderId);
  });


});