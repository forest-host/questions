
import chai from 'chai';
const assert = chai.assert;

import * as questions from '../src';

describe('validate(name, data)', () => {
  let questionaire = questions.get_questionaire('test');

  it('should throw validation error for invalid data', () => {
    let data = { field: 'test' };

    assert.throws(() => questions.validate(questionaire, data), questions.ValidationError);
  });

  it('should throw validation error for invalid data types', () => {
    let data = {
      // string instead of number
      year_of_birth: '125',
      sex: 'male',
      fever: false,
    };

    let callback = () => questions.validate(questionaire, data);

    assert.throws(callback, questions.ValidationError);

    try {
      callback();
    } catch(err) {
      assert.propertyVal(err.questions, 'year_of_birth', 'invalid_integer');
    }
  })

  describe('required', () => {
    it('errors for required questions', () => {
      let data = { 
        sex: 'male',
        fever: false,
      };

      try {
        questions.validate(questionaire, data);
      } catch(err) {
        assert.propertyVal(err.questions, 'year_of_birth', 'required');
      }
    })

    it('errors for required empty multiselect questions', () => {
      let data = { 
        year_of_birth: 1992,
        sex: 'male',
        symptoms: [],
      };

      try {
        questions.validate(questionaire, data);
      } catch(err) {
        assert.propertyVal(err.questions, 'symptoms', 'required');
      }
    })
  })

  describe('required_answer', () => {
    it('errors for answers that differ from required_answer', () => {
      let data = {
        responding_for: "somebody_else",
        asked_permission: false,
      };

      try {
        questions.validate(questionaire, data);
      } catch(err) {
        assert.propertyVal(err.questions, 'asked_permission', 'required_answer');
      }
    })
  })

  describe('conditions', () => {
    it('does not error for conditional questions without met conditions', () => {
      assert.doesNotThrow(() => questions.validate(questionaire, {
        year_of_birth: 1992,
        email: 'hello@forest.host',
        symptoms: ['cough'],
        sex: 'male',
        location: [0.252, 28.251],
        responding_for: "self",
      }));

      assert.doesNotThrow(() => questions.validate(questionaire, {
        year_of_birth: 1992,
        email: 'hello@forest.host',
        symptoms: ['cough'],
        sex: 'male',
        location: [0.252, 28.251],
        // not_answer question
        responding_for: "somebody_else",
        asked_permission: true,
      }));
    })

    it('does error for conditional questions with conditions met', () => {
      let data = {
        year_of_birth: 1992,
        sex: 'male',
        fever: true,
      };

      let callback = () => questions.validate(questionaire, data);

      assert.throws(callback, questions.ValidationError);

      try {
        callback();
      } catch(err) {
        assert.propertyVal(err.questions, 'fever_degrees', 'required');
      }
    })
  })

  describe('email', () => {
    it('errors for invalid email address', () => {
      let data = {
        year_of_birth: 1992,
        email: 'gnorsk',
        symptoms: ['cough'],
        sex: 'male',
        location: [0.252, 28.251],
        responding_for: "self",
      };

      let callback = () => questions.validate(questionaire, data);


      assert.throws(callback, questions.ValidationError);

      try {
        callback();
      } catch(err) {
        assert.propertyVal(err.questions, 'email', 'invalid_email');
      }
    });

    it('errors for disposabe email domain', () => {
      let data = {
        year_of_birth: 1992,
        email: 'gnorsk@mailinator.com',
        symptoms: ['cough'],
        sex: 'male',
        location: [0.252, 28.251],
        responding_for: "self",
      };

      let callback = () => questions.validate(questionaire, data);


      assert.throws(callback, questions.ValidationError);

      try {
        callback();
      } catch(err) {
        assert.propertyVal(err.questions, 'email', 'invalid_email');
      }
    });

    it('does not error for valid emailaddress', () => {
      let data = {
        year_of_birth: 1992,
        email: 'hello@forest.host',
        symptoms: ['cough'],
        sex: 'male',
        location: [0.252, 28.251],
        responding_for: "self",
      };

      assert.doesNotThrow(() => questions.validate(questionaire, data));
    })
  })

  describe('min/max', () => {
    it('errors for out of bounds input', () => {
      let data = {
        year_of_birth: 1023,
        sex: 'male',
      };

      let callback = () => questions.validate(questionaire, data);

      assert.throws(callback, questions.ValidationError);

      try {
        callback();
      } catch(err) {
        assert.propertyVal(err.questions, 'year_of_birth', 'out_of_bounds');
      }
     
    })
  
    it('does not error for in bounds input', () => {
      let data = {
        year_of_birth: 1923,
        email: 'hello@forest.host',
        symptoms: ['cough'],
        sex: 'male',
        location: [0.252, 28.251],
        responding_for: "self",
        asked_permission: true,
      };

      assert.doesNotThrow(() => questions.validate(questionaire, data));
    })
  })

  describe('other', () => {
    it('allows string input instead of question type for `other` config', () => {
      let data = {
        year_of_birth: 1923,
        email: 'hello@forest.host',
        symptoms: ['cough'],
        sex: 'non-binary',
        location: [0.252, 28.251],
        responding_for: "self",
        asked_permission: true,
      };

      assert.doesNotThrow(() => questions.validate(questionaire, data));
    })
    
    it('only allows question type input for non-other questions', () => {
      let data = {
        year_of_birth: 'long ago',
        sex: 'non-binary',
      };

      assert.throws(() => questions.validate(questionaire, data), questions.ValidationError);
    })
  })

  it('strips questions that are not part of questionaire when returning valid data', () => {
    let data = {
      year_of_birth: 1923,
      email: 'hello@forest.host',
      sex: 'non-binary',
      symptoms: ['cough'],
      non_existant: 'value',
      location: [0.252, 28.251],
      responding_for: "self",
      asked_permission: true,
    };

    let clean = questions.validate(questionaire, data);
    assert.notProperty(clean, 'non_existant');
  })
})
