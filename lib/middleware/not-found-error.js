const notFoundError = () => ({ method, path }, res, _next) => {
  return res
    .status(404)
    .json({ code: 404, message: `Cannot ${method} ${path}` });
};

export default notFoundError;
