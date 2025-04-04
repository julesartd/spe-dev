function FileFormatError(message) {
    this.name = 'FileFormatError';
    this.message = message || 'Invalid file format';
    this.status = 400; // Bad Request

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FileFormatError);
    } else {
      this.stack = new Error().stack;
    }
  }
  
  FileFormatError.prototype = Object.create(Error.prototype);
  FileFormatError.prototype.constructor = FileFormatError;
  
  module.exports = FileFormatError;