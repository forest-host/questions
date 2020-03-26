
import * as symptotrack from './';
import disposabe_domains from 'disposable-email-domains';

export class ValidationError extends Error {
  constructor(questions) {
    super('Validation errors occurred');
    this.questions = questions;
  }
}

// Check if all condtions are met, meaning we have to validate this question
const conditions_met = function(questions, question_name, data) {
  let question = questions[question_name]
  
  if( ! question.hasOwnProperty('conditions')) {
    // No conditions
    return true;
  } else {
    return question.conditions.reduce((all_met, condition) => {
      let condition_submitted = data.hasOwnProperty(condition.question);

      // When condition is not submitted, it cannot be met
      if( ! condition_submitted) {
        return false;
      }

      let condition_met = false;

      // Check if expected answer is submitted
      if(condition.hasOwnProperty('answer')) {
        condition_met = data[condition.question] == condition.answer;
      } else if(condition.hasOwnProperty('not_answer')) {
        condition_met = data[condition.question] != condition.not_answer;
      }

      return all_met && condition_met;
    }, true);
  }
}

export const is_answer = function(question, answer) {
  switch(question.type) {
    case 'boolean': 
      return typeof(answer) == 'boolean';
    case 'integer':
      return typeof(answer) == 'number' && Math.round(answer) == answer;
    case 'float':
      return typeof(answer) == 'number';
    case 'text':
      return typeof(answer) == 'string';
    case 'select':
      return question.options.indexOf(answer) != -1;
    case 'multiselect':
      return Array.isArray(answer) && answer.reduce((all_ok, option) => { 
        return all_ok && question.options.indexOf(option) != -1 
      }, true);
    case 'date':
      return typeof(answer) == 'date';
    case 'email':
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(answer).toLowerCase())
        && disposabe_domains.indexOf(answer.substring(answer.lastIndexOf('@') +1)) === -1;
    case 'coordinates':
      // Is array of 2 coords
      return Array.isArray(answer) 
        && answer.length == 2 
        && typeof(answer[0]) === 'number'
        && typeof(answer[1]) === 'number'
        // Is actually a coord
        && answer[0] <= 180 && answer[0] >= -180
        && answer[1] <= 90 && answer[1] >= -90
  }
}

export const is_other_answer = function(question, answer) {
  return question.type !== 'string' && question.other && typeof(answer) === 'string';
}

const get_errors = function(questions, data) {
  return Object.keys(questions).reduce((errors, question_name) => {
    let question = questions[question_name];

    // Only validate when conditions are met
    if(conditions_met(questions, question_name, data)) {
      // Is this field required?
      if(question.required
        && ( 
          // Could be this is a multiselect with 0 answers
          ! data.hasOwnProperty(question_name) 
          || ( Array.isArray(data[question_name]) && data[question_name].length == 0)
        )
      ) 
      {
        return { ...errors, [question_name]: 'required' };
      }

      // Required answer can be passed to force answer (used for required checkboxes)
      if(question.hasOwnProperty('required_answer') 
        && ( ! data.hasOwnProperty(question_name) || data[question_name] !== question.required_answer))
      {
        return { ...errors, [question_name]: 'required_answer' }
      }

      // Only validate when value is passed
      if(data.hasOwnProperty(question_name)) {
        let answer = data[question_name];

        // Is this a valid answer based on question type or is this valid "other" question
        if( ! is_answer(question, answer) && ! is_other_answer(question, answer)) {
          return { ...errors, [question_name]: `invalid_${question.type}` };
        }
        
        // Type specific rules
        switch(question.type) {
          case 'float':
          case 'integer': 
            if(answer < question.min || answer > question.max) {
              return { ... errors, [question_name]: 'out_of_bounds' };
            };
        };
      }
    }

    return errors;

  }, {});
}

// Pick keys from object
const pick = function(...keys) {
  return function(o) {
    return keys.reduce((a, key) => {
      // Only add key when its in object
      if(o.hasOwnProperty(key)) {
        return ({ ...a, [key]: o[key] })
      }

      return a;
    }, {});
  }
}

export const validate = function(questionaire, data) {
  let questions = symptotrack.get_questions(questionaire);
  let errors = get_errors(questions, data);

  if(Object.keys(errors) == 0) {
    let validated_question_names = Object.keys(questions)
      .filter(question_name => conditions_met(questions, question_name, data));

    return pick(...validated_question_names)(data);
  } else {
    throw new ValidationError(errors);
  }
}

