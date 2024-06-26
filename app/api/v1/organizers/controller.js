const {
  createOrganizer,
  createUsers,
  getAllUsers,
} = require("../../../services/mongoose/users");
const { StatusCodes } = require("http-status-codes");

const getCMSUser = async (req, res, next) => {
  try {
    const result = await getAllUsers();

    res.status(StatusCodes.OK).json({
      message: result,
    });
  } catch (err) {
    console.log(err);
  }
};

const createCMSOrganizer = async (req, res, next) => {
  try {
    const result = await createOrganizer(req);

    res.status(StatusCodes.CREATED).json({ message: result });
  } catch (error) {
    next(error);
  }
};

const createCMSUser = async (req, res, next) => {
  try {
    const result = await createUsers(req);

    res.status(StatusCodes.CREATED).json({
      message: result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { createCMSOrganizer, createCMSUser, getCMSUser };
