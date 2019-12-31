const serverError = () => (err, req, res, _next) => {
  let message = '';

  if (Array.isArray(err.error)) {
    message = err.error.map((e) => `${e.param}: ${e.msg}`).toString();
  } else {
    message = !err.error
      ? err.message
      : `${err.error.message} ${err.error.detail || ''}`;
  }

  return res
    .status(500)
    .json({ code: 500, message: 'Internal server error.', detail: message });
};

export default serverError;
