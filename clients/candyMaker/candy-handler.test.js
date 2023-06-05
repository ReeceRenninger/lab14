'use strict';



const { confirmOrder, thankCustomer } = require('./handler');
// const store = 'Eva\'s Sweet\'s & Reece\'s Pieces';

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

describe('Vendor handlers', () => {

  test('Should log correct emit and console log for confirmOrder', () => {
    let payload ={
      order : {
        orderId: 12345,
      },
    };

    console.log('payload', payload);
    confirmOrder(payload);

    expect(consoleSpy).toHaveBeenCalledWith('VENDOR: We have received your order:', payload.order.orderId);

  });

  test('Should log correct emit and console log for thankCustomer', () => {
    let payload = {
      order: {
        customer: 'Harry Potter',
      },
    };

    thankCustomer(payload);

    expect(consoleSpy).toHaveBeenCalledWith('VENDOR: Thank you for your candy order', payload.order.orderId);
  });

});