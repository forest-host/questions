# Question

Questions (and possible answers) for symptotrack.org.

## Types & tags
Types define the type of answers (boolean, string, etc). Tags define a subset and enable you to use prepopulated answers.
Default types and tags are defined in `defaults`

## Questionaires
Each questionaire is defined in a config file in `questionaires` and each has a name. In the config the questions have a simplefied key and the structure of the question and answers are defined.
Every questionaire has a translation with the full questions, additional information and translated answers.

## Questions and translations
A question can be configured like this:
```
"fever_degrees": {
  "type": "number",
  "decimals": 1,
  "tag": "temperature",
  "conditionals": [
    {
      "question": "fever",
      "answer": "yes"
    }
  ]
}
```

To translate this to Dutch this question will be defined as (in `translations/nl_nl.json`):
```
"fever_degrees": {
  "question": "How warm are you? in Celcius"
}
```
No additional answers are needed here since we ask for a number.


## TODO
- Optional next button to group questions
- Meta questions
