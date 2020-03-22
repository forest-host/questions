

# Question


## Question
optional next button text

on saving a questionaire we save a link to each question asked, when somebody answered 'i dont know' or 'none of the above', we don't save an answer
this way we know what questions were asked, and what questions were answered

should support conditional tag with regard to other questions answers (multiple links should be possible)


### Types of questions:

#### bool (are these going to be 1 - 5 questions?)
should have `yes` and `no` and `skip` answer map
should support questions without `skip`
should have "other" support

#### Select
should have answer map
should have "other" support, meaning free text input on "other" select, `can_be_other`

#### Multiselect
should have tag like countries or disseases
multiple bools or multiple strings

- countries you've been to
- medication you've taken
- Allergies

#### Integer
just int/float input
should support returning range
should support tags like 'year' or 'temperature'

- How many tobacco
- Transport times

#### Varchar

#### Date

#### Meta vraag?


