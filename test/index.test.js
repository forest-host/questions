
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
    assert.deepEqual(questions.get_questionaires(), ['basic', 'extended']);
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
