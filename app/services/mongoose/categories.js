const Categories = require("../../api/v1/categories/model");

const { NotFoundError, BadRequestError } = require("../../errors");

const getAllCategories = async () => {
  const result = await Categories.find();

  return result;
};

const createCategories = async (req) => {
  const { name } = req.body;

  const findCategories = await Categories.findOne({ name });

  if (findCategories) throw new BadRequestError("Kategori nama duplikat");

  const result = await Categories.create({ name });

  return result;
};

const getOneCategories = async (req) => {
  const { id } = req.params;

  const result = await Categories.findOne({ _id: id });
  if (!result) throw new NotFoundError(`Tidak ada kategori id : ${id}`);

  return result;
};

const updateCategories = async (req) => {
  const { id } = req.params;
  const { name } = req.body;

  const check = await Categories.findOne({
    name,
    _id: { $ne: id }, // $ne berfungsi untuk cari selain id tersebut
  });

  if (check) throw new BadRequestError("Kategori nama duplikat");

  const result = await Categories.findOneAndUpdate(
    { _id: id },
    { name },
    { new: true, runValidators: true }
  );

  if (!result) throw new NotFoundError(`Tidak ada kategori id : ${id}`);

  return result;
};

const deleteCategories = async (req) => {
  const { id } = req.params;
  const check = await Categories.findOne({ _id: id });

  if (!check) throw new NotFoundError(`Tidak ada kategori id : ${id}`);

  const result = await Categories.findByIdAndDelete({ _id: id });

  return result;
};

const checkingCategories = async (id) => {
  const result = await Categories.findOne({ _id: id });

  if (!result) throw new NotFoundError(`Tidak ada kategori id : ${id}`);

  return result;
};

module.exports = {
  getAllCategories,
  createCategories,
  getOneCategories,
  updateCategories,
  deleteCategories,
  checkingCategories,
};
