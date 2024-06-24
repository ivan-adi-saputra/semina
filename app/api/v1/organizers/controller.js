const { createOrganizer } = require("../../../services/mongoose/users");
const { StatusCodes } = require("http-status-codes");

const createCMSOrganizer = async (req, res, next) => {
  try {
    const result = await createOrganizer(req);

    res.status(StatusCodes.CREATED).json({ message: result });
  } catch (error) {
    next(error);
  }
};

module.exports = { createCMSOrganizer };
