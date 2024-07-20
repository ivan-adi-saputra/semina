const Users = require("../../api/v1/users/model");
const { BadRequestError, UnauthorizedError } = require("../../errors");
const { createTokenUser, createJWT } = require("../../utils");

const signin = async (req) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new BadRequestError("Please provide email & password");

  const result = await Users.findOne({ email: email });

  if (!result) throw new UnauthorizedError("Invalid credentials");

  const isPasswordCorrect = await result.comparePassword(password);
  if (!isPasswordCorrect) throw new UnauthorizedError("Invalid credentials");

  const token = createJWT({ payload: createTokenUser(result) });

  return { token, role: result.role };
};

module.exports = { signin };
