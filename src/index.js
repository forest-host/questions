
import require_dir from 'require-dir';

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
        let group = questionaire.groups[name];

        return Object.keys(group).map(name => {
          let question = group[name];
          return question.type;
        })
      })
    })
    .filter(unique);
}

/**
 * Get a list of questionaires
 */
export const get_questionaires = function() {
  return Object.keys(questionaires);
}

/**
 * Get questionaire config for a questionaire with all blanks filled with defaults
 */
export const get_questionaire = function(name) {
  let config = questionaires[name].config;

  Object.keys(config.groups).forEach(group_name => {
    Object.keys(config.groups[group_name]).forEach(question_name => {
      let question_config = config.groups[group_name][question_name];


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
  })

  return config;
}

export const get_questionaire_locales = function(name) {
  return Object.keys(questionaires[name].translations);
}

// TODO 
export const get_questionaire_translations = function(name) {
}
