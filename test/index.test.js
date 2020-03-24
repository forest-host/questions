
import chai from 'chai';
const assert = chai.assert;

import * as questions from '../src';


describe('get_question_types()', () => {
  it('returns an array of question types', () => {
    let types = questions.get_question_types();

    assert.include(types, 'integer');
    assert.include(types, 'text');
  })
})

describe('get_questionaires()', () => {
  it('should return a list of questionaires', () => {
    assert.deepEqual(questions.get_questionaires(), ['basic', 'extended', 'test']);
  })
})

describe('get_questionaire(name)', () => {
  it('should return questionaire config', () => {
    assert.isNotNull(questions.get_questionaire('basic'));
  });

  it('should merge defaults for every question', () => {
    let config = questions.get_questionaire('basic');

    assert.isNotNull(config.groups.symptoms.year_of_birth.other);
  })
})

describe('get_questionaire_locales(name)', () => {
  it('should return a list of locales for questionaire', () => {
    let locales = questions.get_questionaire_locales('basic');

    assert.include(locales, 'nl_nl');
  })
})

describe('get_questionaire_translations(name)', () => {
  it('should return translations merged with defaults');
})

describe('validate(name, data)', () => {
  let questionaire = questions.get_questionaire('test');

  it('should throw validation error for invalid data', () => {
    let data = { field: 'test' };

    assert.throws(questions.validate('test', data), questions.ValidationError);
  });

  describe('required', () => {
    it('errors for required fields', () => {
      let data = { 
        sex: 'male',
        fever: true,
      };

      try {
        questions.validate('test', data);
      } catch(err) {
        assert.propertyVal(err.fields, 'year_of_birth', 'required');
        assert.lengthOf(Object.keys(err.fields), 1);
      }
    })

    it('does not error for optional fields', () => {
      let data = {
        year_of_birth: 1992,
        sex: 'male',
      };

      assert.notThrows(questions.validate('test', data));
    })
  })

  describe('min/max', () => {
    it('errors for out of bounds input')
  
    it('does not error for in bounds input')
  })

  describe('other', () => {
    it('allows string input instead of question type for `other` config')
    
    it('only allows question type input for non-other questions')
  })

  describe('conditionals', () => {
    it('only requires conditional questions when conditions are matched');

    it('strips conditional questions input from data when conditions are not matched')
  })

  it('strips fields that are not part of questionaire when returning valid data')
})
