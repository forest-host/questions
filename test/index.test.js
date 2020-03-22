
import chai from 'chai';
const assert = chai.assert;

import * as questions from '../src';

describe('questions', () => {
  it('should export defaults', () => {
    assert.isNotNull(questions.defaults);
  });
  it('should export questionaires', () => {
    assert.isNotNull(questions.questionaires.basic);
  });
})
