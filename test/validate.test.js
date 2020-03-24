
import chai from 'chai';
const assert = chai.assert;

import * as questions from '../src';

describe('validate(name, data)', () => {
  let questionaire = questions.get_questionaire('test');

  it('should throw validation error for invalid data', () => {
    let data = { field: 'test' };

    assert.throws(() => questions.validate('test', data), questions.ValidationError);
  });

  it('should throw validation error for invalid data types', () => {
    let data = {
      // string instead of number
      year_of_birth: '125',
      sex: 'male',
      fever: false,
    };

    let callback = () => questions.validate('test', data);

    assert.throws(callback, questions.ValidationError);

    try {
      callback();
    } catch(err) {
      assert.propertyVal(err.fields, 'year_of_birth', 'invalid_input');
    }
  })

  describe('required', () => {
    it('errors for required fields', () => {
      let data = { 
        sex: 'male',
        fever: false,
      };

      try {
        questions.validate('test', data);
      } catch(err) {
        assert.propertyVal(err.fields, 'year_of_birth', 'required');
        assert.lengthOf(Object.keys(err.fields), 1);
      }
    })
  })

  describe('conditions', () => {
    it('does not error for conditional fields without met conditions', () => {
      let data = {
        year_of_birth: 1992,
        sex: 'male',
      };

      assert.doesNotThrow(() => questions.validate('test', data));
    })

    it('does error for conditional fields with conditions met', () => {
      let data = {
        year_of_birth: 1992,
        sex: 'male',
        fever: true,
      };

      let callback = () => questions.validate('test', data);

      assert.throws(callback, questions.ValidationError);

      try {
        callback();
      } catch(err) {
        assert.propertyVal(err.fields, 'fever_degrees', 'required');
      }
    })
  })

  describe('min/max', () => {
    it('errors for out of bounds input', () => {
      let data = {
        year_of_birth: 1023,
        sex: 'male',
      };

      let callback = () => questions.validate('test', data);

      assert.throws(callback, questions.ValidationError);

      try {
        callback();
      } catch(err) {
        assert.propertyVal(err.fields, 'year_of_birth', 'out_of_bounds');
      }
     
    })
  
    it('does not error for in bounds input', () => {
      let data = {
        year_of_birth: 1923,
        sex: 'male',
      };

      assert.doesNotThrow(() => questions.validate('test', data));
    })
  })

  describe('other', () => {
    it('allows string input instead of question type for `other` config', () => {
      let data = {
        year_of_birth: 1923,
        sex: 'non-binary',
      };

      assert.doesNotThrow(() => questions.validate('test', data));
    })
    
    it('only allows question type input for non-other questions', () => {
      let data = {
        year_of_birth: 'long ago',
        sex: 'non-binary',
      };

      assert.throws(() => questions.validate('test', data), questions.ValidationError);
    })
  })

  it('strips fields that are not part of questionaire when returning valid data', () => {
    let data = {
      year_of_birth: 1923,
      sex: 'non-binary',
      non_existant: 'value',
    };

    let clean = questions.validate('test', data);

    assert.notProperty(clean, 'non_existant');
  })
})
