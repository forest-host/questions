
import chai from 'chai';
const assert = chai.assert;

import * as symptotrack from '../src';


describe('get_question_types()', () => {
  it('returns an array of question types', () => {
    let types = symptotrack.get_question_types();

    assert.include(types, 'integer');
    assert.include(types, 'text');
  })
})

describe('get_questionaires()', () => {
  it('should return a list of questionaires', () => {
    assert.deepEqual(symptotrack.get_questionaires(), ['basic', 'extended', 'test']);
  })
})

describe('get_questionaire(name, only_recurring)', () => {
  let questionaire = symptotrack.get_questionaire('test');

  it('should return questionaire config', () => {
    assert.isDefined(questionaire.groups);
  });

  it('should merge defaults for every question', () => {
    assert.isDefined(questionaire.groups.symptoms.questions.fever.other);
  })

  it('should add group defaults', () => {
    assert.isDefined(questionaire.groups.symptoms.recurring);
  })

  it('should only return recurring groups when asked', () => {
    let questionaire = symptotrack.get_questionaire('test', true);
    assert.lengthOf(Object.keys(questionaire.groups), 1);
  })
})

describe('get_locales()', () => {
  it('should return an aggregate of all possible locales used by all questionaires', () => {
    let locales = symptotrack.get_locales();

    assert.include(locales, 'nl_nl');
  })
})

describe('get_questionaire_locales(name)', () => {
  it('should return a list of locales for questionaire', () => {
    let locales = symptotrack.get_questionaire_locales('basic');

    assert.include(locales, 'nl_nl');
  })
})

describe('get_questionaire_translations(locale)', () => {
  it('should return translations merged with defaults', () => {
    let translations = symptotrack.get_questionaire_translations('basic', 'nl_nl');

    assert.property(translations, 'groups');
    assert.property(translations, 'questions');
  });
})

describe('get_error_translations(locale)', () => {
  it('Returns error translations');
})
