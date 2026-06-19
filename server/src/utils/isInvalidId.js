function isInvalidId(id) {
  return Number.isNaN(+id);
}

module.exports = isInvalidId;
