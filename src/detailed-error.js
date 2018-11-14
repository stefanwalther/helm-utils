
// https://gist.github.com/slavafomin/b164e3e710a6fc9352c934b9073e7216
module.exports = class DetailedError extends Error {

  constructor (message) {

    // Calling parent constructor of base Error class.
    super(message);

    // Saving class name in the property of our custom error as a shortcut.
    this.name = 'Error';

    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, this.constructor);

  }
};
