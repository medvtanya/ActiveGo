const formatResponse = require("../utils/formatResponse");
const isInvalidId = require("../utils/isInvalidId");

module.exports = (req, res, next) => {
  const { id } = req.params;

  if (isInvalidId(id)) {
    return res.status(400).json(formatResponse(400, "Put number id"));
  }

  res.locals.id = id;
  return next();
};


