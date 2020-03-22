# Question

Questions (and possible answers) for symptotrack.org.

## Types & tags
Types define the type of answers (boolean, string, etc). Tags define a subset and enable you to use prepopulated answers.
Default types and tags are defined in `defaults`
If you add `other: true` to a question which adds the option `other` to the answers, this means a string can be passed in addition to the answer `other`.

### bool
A boolean is true, false or skip (I don't know)
Add `required: true` which will remove the skip option.

### coordinates

### number
A number can be saved with decimals, pass param to set number of decimals.
A couple of tags are available:
- year (expects YYYY)
- temperature (expects Celcius)

### select
A select question has multiple possible answers but only one answer can be given

### text
Well, text

### date
Well, date

### multiselect
A multiselect, like select, has multiple possible answers and multiple answers can be passed
The tag `country` is available and loads a list of countries based on locale as possible answers


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
