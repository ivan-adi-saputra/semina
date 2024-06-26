const Users = require("../../api/v1/users/model");
const Organizers = require("../../api/v1/organizers/model");
const { BadRequestError } = require("../../errors");

const createOrganizer = async (req) => {
  const { organizer, name, email, password, confirmedPassword, role } =
    req.body;

  if (password !== confirmedPassword)
    throw new BadRequestError("Password dan konfirmasi password tidak cocok");

  const result = await Organizers.create({ organizer });

  const users = await Users.create({
    name,
    email,
    password,
    role,
    organizer: result._id,
  });

  delete users._doc.password;

  return users;
};

const createUsers = async (req) => {
  const { name, email, password, confirmedPassword, role } = req.body;

  if (password !== confirmedPassword)
    throw new BadRequestError("Password dan konfirmasi password tidak cocok");

  const result = await Users.create({
    name,
    email,
    password,
    role,
    organizer: req.user.organizer,
  });

  delete users._doc.password;

  return result;
};

const getAllUsers = async () => {
  const result = await Users.find();

  return result;
};

module.exports = { createOrganizer, createUsers, getAllUsers };
