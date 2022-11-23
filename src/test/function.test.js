import { updateStepMinuteValue, parseStepsTime } from './function';

describe('get number type of step time', () => {
  test('test updateStepMinuteValue', () => {
    const actualValue = [{
      stepMinute: '1',
      stepSecond: '1',
      stepTime: 61,
    }, {
      stepMinute: '2',
      stepSecond: '1',
      stepTime: 121,
    }];
    const expectedValue = [{
      stepMinute: '1',
      stepSecond: '1',
      stepTime: 61,
    }, {
      stepMinute: '3',
      stepSecond: '1',
      stepTime: 181,
    }];
    expect(updateStepMinuteValue('3', actualValue, 1)).toEqual(expectedValue);
  });

  test('test parseStepsTime', () => {
    const actualValue = [{
      stepMinute: '1',
      stepSecond: '1',
      stepTime: 61,
    }, {
      stepMinute: '3',
      stepSecond: '1',
      stepTime: 181,
    }];
    const expectedValue = [{
      stepMinute: 1,
      stepSecond: 1,
      stepTime: 61,
    }, {
      stepMinute: 3,
      stepSecond: 1,
      stepTime: 181,
    }];
    expect(parseStepsTime(actualValue)).toEqual(expectedValue);
  });
});
