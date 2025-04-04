const FileFormatError = require("../errors/fileFormatError");

const jsonErrorMiddleware = (err, req, res, next) => {
  console.error(err);

  if (err instanceof FileFormatError) {
    return res.status(err.status).json({
      error: {
        code: 'INVALID_FILE_TYPE',
        status: err.status,
        message: err.message,
      },
    });
  }

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const formattedErrors = {};
    let modelName = 'unknown'; // fallback model name

    err.errors.forEach((error) => {
      if (error.instance && error.instance.constructor && error.instance.constructor.name) {
        modelName = error.instance.constructor.name.toLowerCase();
      }

      const field = error.path;
      const message = error.message;

      if (!formattedErrors[field]) {
        formattedErrors[field] = [];
      }

      formattedErrors[field].push({
        message: message,
        validatorKey: error.validatorKey || null,
      });
    });

    return res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        status: 422,
        details: {
          [modelName]: formattedErrors,
        },
      },
    });
  }

  return res.status(err.status || 500).json({
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      status: err.status || 500,
      message: err.message || 'Une erreur interne est survenue.',
    },
  });
};

module.exports = jsonErrorMiddleware;