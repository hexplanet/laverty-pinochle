import * as gameActionTypes from './gameActionTypes';
describe('gameActionTypes', () => {
  test('All gameActionTypes equal the string version of the key', () => {
    Object.keys(gameActionTypes).forEach((key) => {
      expect(gameActionTypes[key]).toEqual(key);
    });
  });
});
