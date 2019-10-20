export default class BaseValidator {
  static get SCHEMA_VALIDATION_ERROR() {
    return 'Schema validation fails';
  }

  constructor(req, res) {
    this.req = req;
    this.res = res;
  }
}
