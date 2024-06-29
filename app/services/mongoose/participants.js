const Participant = require("../../api/v1/participants/model");
const Events = require("../../api/v1/events/model");
const Orders = require("../../api/v1/orders/model");
const { createTokenParticipant, createJWT } = require("../../utils");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../../errors");
const { otpMail } = require("../mail");

const signupParticipant = async (req) => {
  const { firstName, lastName, email, password, role } = req.body;

  let result = await Participant.findOne({
    email,
    status: "tidak aktif",
  });

  if (result) {
    result.firstName = firstName;
    result.lastName = lastName;
    result.role = role;
    result.email = email;
    result.password = password;
    result.otp = Math.floor(Math.random() * 9999);
    await result.save();
  } else {
    result = await Participant.create({
      firstName,
      lastName,
      email,
      password,
      role,
      otp: Math.floor(Math.random() * 9999),
    });
  }
  await otpMail(email, result);

  delete result._doc.password;
  delete result._doc.otp;

  return result;
};

const activateParticipant = async (req) => {
  const { email, otp } = req.body;
  const check = await Participant.findOne({
    email,
  });

  if (!check) throw new NotFoundError("Participant belum terdaftar");

  if (check && check.otp !== otp) throw new BadRequestError("kode otp salah");

  const result = await Participant.findByIdAndUpdate(
    check._id,
    {
      status: "aktif",
    },
    { new: true }
  );

  delete result._doc.password;

  return result;
};

const signinParticipant = async (req) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const result = await Participant.findOne({ email: email });

  if (!result) {
    throw new UnauthorizedError("Invalid Credentials");
  }

  if (result.status === "tidak aktif") {
    throw new UnauthorizedError("Akun anda belum aktif");
  }

  const isPasswordCorrect = await result.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthorizedError("Invalid Credentials");
  }

  const token = createJWT({ payload: createTokenParticipant(result) });

  return token;
};

const getAllEvents = async (req) => {
  const result = await Events.find({ statusEvent: "Published" })
    .populate("category")
    .populate("image")
    .select("_id title date tickets venueName");

  return result;
};

const getOneEvent = async (req) => {
  const { id } = req.params;
  const result = await Events.findOne({ _id: id })
    .populate("category")
    .populate({ path: "talent", populate: "image" })
    .populate("image");

  if (!result) throw new NotFoundError(`Tidak ada acara dengan id :  ${id}`);

  return result;
};

const getAllOrders = async (req) => {
  const result = await Orders.find({ participant: req.participant.id });
  return result;
};

module.exports = {
  signupParticipant,
  activateParticipant,
  signinParticipant,
  getAllEvents,
  getOneEvent,
  getAllOrders,
};
