'use strict';

let socket = require('../socket-client');

const orderCreator = require('./handler');

jest.mock('../socket-client', () => {
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

describe('Customer tests', () => {
  test('Can generate an order with orderCreator', () => {
    let order = {
      orderId: 12345,
    };
    let payload = {
      event: 'customerOrder',
      messageId: order.orderId,
      queueId: 'Eva\'s Sweet\'s & Reece\'s Pieces',
      order,
    };
      
    orderCreator(socket, order);
    expect(consoleSpy).toHaveBeenCalledWith('CUSTOMER: Order was requested for', payload.order.orderId);
    expect(socket.emit).toHaveBeenCalledWith('customerOrder', payload);
  });


});