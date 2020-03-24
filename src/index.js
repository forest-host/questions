
import require_dir from 'require-dir';
export * from './validator';


const defaults = require_dir('../defaults', { recurse: true });
const questionaires = require_dir('../questionaires', { recurse: true });

// Unique value filter
const unique = function(value, index, array) {
  return array.indexOf(value) === index;
}

// Get question type strings from questionaires
export const get_question_types = function() {
  return Object
    .keys(questionaires)
    .flatMap(name => {
      let questionaire = questionaires[name].config;

      return Object.keys(questionaire.groups).flatMap(name => {
        let questions = questionaire.groups[name].questions;

        return Object.keys(questions).map(name => {
          return questions[name].type;
        })
      })
    })
    .filter(unique);
}

/**
 * Get a list of questionaires
 */
export const get_questionaires = function() {
  return Object.keys(questionaires)
    // Only return test questionaire in testing envs
    .filter(name => name != 'test' || process.env.NODE_ENV == 'testing')
}

/**
 * Get questionaire config for a questionaire with all blanks filled with defaults
 */
export const get_questionaire = function(name, only_recurring = false) {
  if(process.env.NODE_ENV !== 'testing' && name == 'test') {
    throw new Error('test questionaire can only be used in testing environments');
  }

  // Clone config to not change globals, use clone & foreach instead of mapping everything as 
  // JSON is natively implemented in browsers/node and therefore more performant
  let config = JSON.parse(JSON.stringify(questionaires[name].config));

  // Add defaults to clone
  let groups = Object.keys(config.groups).forEach(group_name => {
    let group = config.groups[group_name];

    // Add group defaults
    if( ! group.hasOwnProperty('recurring')) {
      group.recurring = defaults.config.groups.recurring;
    }

    // Remove groups when only recurring groups are requested
    if( ! group.recurring && only_recurring) {
      delete config.groups[group_name];
      return;
    }

    // Add question defaults
    Object.keys(group.questions).forEach(question_name => {
      let question_config = group.questions[question_name];

      // Add defaults when they dont exist on question
      Object.keys(defaults.config.defaults).forEach(key => {
        if( ! question_config.hasOwnProperty(key)) {
          question_config[key] = defaults.config.defaults[key];
        }
      })

      // Defaults for type?
      if(defaults.config.types.hasOwnProperty(question_config.type)) {
        let type_config = defaults.config.types[question_config.type];

        // First add variant defaults
        if(question_config.hasOwnProperty('variant') 
          && type_config.hasOwnProperty('variants') 
          && type_config.variants.hasOwnProperty(question_config.variant))
        {
          // Add variant config to question_config
          Object.keys(type_config.variants[question_config.variant]).forEach(key => {
            if( ! question_config.hasOwnProperty(key)) {
              question_config[key] = type_config.variants[question_config.variant][key];
            }
          })
        }

        // Add type defaults ( after variant defaults so we don't add type defaults when variant defaults exist)
        if(type_config.hasOwnProperty('defaults')) {
          Object.keys(type_config.defaults).forEach(key => {
            if( ! question_config.hasOwnProperty(key)) {
              question_config[key] = type_config.defaults[key];
            }
          })
        }
      }
    })
  });

  return config;
}

export const get_locales = function() {
  return Object
    .keys(questionaires)
    // Ternary is there to not crash when no translations are present for questionaire
    .flatMap(name => typeof(questionaires[name].translations) !== 'undefined' ? Object.keys(questionaires[name].translations) : [])
    .filter(unique);
}

export const get_questionaire_locales = function(name) {
  return Object.keys(questionaires[name].translations);
}

// TODO 
export const get_questionaire_translations = function(name) {
}
