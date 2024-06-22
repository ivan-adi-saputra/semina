const images = require("../../api/v1/images/model");
const { NotFoundError, BadRequestError } = require("../../errors");

const createImage = async (req) => {
  const result = await images.create({
    name: req.file
      ? `uploads/${req.file.filename}`
      : `uploads/avatar/default.jpg`,
  });

  return result;
};

const checkingImage = async (id) => {
  const result = await images.findOne({ _id: id });

  if (!result) throw new NotFoundError(`Tidak ditemukan Image id: ${id}`);

  return result;
};

module.exports = { createImage, checkingImage };
