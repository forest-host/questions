

export class ValidationError extends Error {
  constructor(fields) {
    super('Validation errors occurred');
    this.fields = fields;
  }
}

export const validate = function(name, data) {
  //console.log(name);
  //console.log(data);
}

