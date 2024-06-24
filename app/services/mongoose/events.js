const Events = require("../../api/v1/events/model");
const { checkingImage } = require("./images");
const { checkingCategories } = require("./categories");
const { checkingTalents } = require("./talents");
const { BadRequestError, NotFoundError } = require("../../errors");

const getAllEvents = async (req) => {
  const { keyword, category, talent } = req.query;

  let condition = {};

  if (keyword) {
    condition = { ...condition, title: { $regex: keyword, $options: "i" } };
  }

  if (category) {
    condition = { ...condition, name: { $regex: category, $options: "i" } };
  }

  if (talent) {
    condition = { ...condition, name: { $regex: talent, $options: "i" } };
  }

  const result = await Events.find(condition)
    .populate({
      path: "image",
      select: "_id name",
    })
    .populate({
      path: "category",
      select: "_id name",
    })
    .populate({
      path: "talent",
      select: "_id name role image",
      populate: {
        path: "image",
        select: "_id name",
      },
    });

  return result;
};

const createEvents = async (req) => {
  const {
    title,
    date,
    about,
    tagline,
    keyPoint,
    venueName,
    statusEvent,
    tickets,
    image,
    category,
    talent,
  } = req.body;
  console.log("test");
  await checkingCategories(category);
  await checkingImage(image);
  await checkingTalents(talent);

  const check = await Events.findOne({ title });

  if (check) throw new BadRequestError("Events sudah terdaftar");

  const result = await Events.create({
    title,
    date,
    about,
    tagline,
    keyPoint,
    venueName,
    statusEvent,
    tickets,
    image,
    category,
    talent,
  });

  return result;
};

const getOneEvents = async (req) => {
  const { id } = req.params;

  const result = await Events.findOne({ _id: id })
    .populate({
      path: "image",
      select: "_id, name",
    })
    .populate({
      path: "category",
      select: "_id name",
    })
    .populate({
      path: "talent",
      select: "_id name role image",
      populate: {
        path: "image",
        select: "_id name",
      },
    });

  if (!result) throw new NotFoundError(`Tidak ada events dengan id: ${id}`);

  return result;
};

const updateEvents = async (req) => {
  const { id } = req.params;
  const {
    title,
    date,
    about,
    tagline,
    keyPoint,
    venueName,
    statusEvent,
    tickets,
    image,
    category,
    talent,
  } = req.body;

  await checkingImage(image);
  await checkingCategories(category);
  await checkingTalents(talent);

  const checkId = await Events.findOne({ _id: id });
  if (!checkId) throw new NotFoundError(`Tidak ada events dengan id: ${id}`);

  const check = await Events.findOne({
    title,
    _id: { $ne: id },
  });

  if (check) throw new BadRequestError("Event sudah terdaftar");

  const result = await Events.findOneAndUpdate(
    {
      _id: id,
    },
    {
      title,
      date,
      about,
      tagline,
      keyPoint,
      venueName,
      statusEvent,
      tickets,
      image,
      category,
      talent,
    },
    { new: true, runValidators: true }
  );

  return result;
};

const deleteEvents = async (req) => {
  const { id } = req.params;

  const result = await Events.findByIdAndDelete(id);

  if (!result) throw new NotFoundError(`Tidak ada events dengan id: ${id}`);

  return result;
};

module.exports = {
  getAllEvents,
  createEvents,
  getOneEvents,
  updateEvents,
  deleteEvents,
};
