const Talents = require("../../api/v1/talents/model");
const { checkingImage } = require("./images");
const { NotFoundError, BadRequestError } = require("../../errors");

const getAllTalents = async (req) => {
  const { keyword } = req.query;

  let condition = {};

  if (keyword) {
    condition = {
      ...condition, // jika variabel ada value maka di copy tidak di remove
      name: {
        $regex: keyword, // jika kita mengetikkan 'm' maka akan muncul semua yang ada hurud m
        $options: "i", // semua ketikan akan dianggap huruf kecil
      },
    };
  }

  const result = await Talents.find(condition) // jika tidak ada condition maka akan menampilkan semua
    .populate({
      // untuk relasi
      path: "image", // relasi dengan image
      select: "_id name", // ambil collection _id dan name dari image
    })
    .select("_id name role image"); // albil _id name role image dari model talent

  return result;
};

const createTalents = async (req) => {
  const { name, role, image } = req.body;

  // cari image dengan field yang sama
  await checkingImage(image);

  // cari nama talent yang sama
  const check = await Talents.findOne({ name });

  if (check) throw new BadRequestError("pembicara nama duplikat");

  const result = await Talents.create({ name, role, image });

  return result;
};

const getOneTalents = async (req) => {
  const { id } = req.params;

  const result = await Talents.findOne({ _id: id })
    .populate({
      path: "image",
      select: "_id name",
    })
    .select("_id name role image");

  if (!result) throw new NotFoundError(`Tidak ada pembicara dengan id: ${id}`);

  return result;
};

const updateTalents = async (req) => {
  const { id } = req.params;
  const { name, role, image } = req.body;

  await checkingImage(image);

  const check = await Talents.findOne({
    name,
    _id: { $ne: id },
  });

  if (check) throw new BadRequestError("pembicara nama duplikat");

  const result = await Talents.findOneAndUpdate(
    { _id: id },
    { name, role, image },
    { new: true, runValidators: true }
  );

  if (!result) throw new NotFoundError(`Tidak ada pembicara dengan id: ${id}`);

  return result;
};

const deleteTalents = async (req) => {
  const { id } = req.params;

  const result = await Talents.findByIdAndDelete(id);

  if (!result)
    throw new BadRequestError(`Tidak ada pembicara dengan id: ${id}`);

  return result;
};

const checkingTalents = async (id) => {
  const result = await Talents.findOne({ _id: id });

  if (!result) throw new NotFoundError(`Tidak ada pembicara dengan id: ${id}`);

  return result;
};

module.exports = {
  getAllTalents,
  createTalents,
  getOneTalents,
  updateTalents,
  deleteTalents,
};
