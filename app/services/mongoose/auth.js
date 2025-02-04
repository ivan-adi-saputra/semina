const Users = require("../../api/v1/users/model");
const { BadRequestError, UnauthorizedError } = require("../../errors");
const { createTokenUser, createJWT, createRefreshJWT } = require("../../utils");
const { createUserRefreshToken } = require("./userRefreshToken");

const signin = async (req) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new BadRequestError("Please provide email & password");

  const result = await Users.findOne({ email: email });

  if (!result) throw new UnauthorizedError("Invalid credentials");

  const isPasswordCorrect = await result.comparePassword(password);
  if (!isPasswordCorrect) throw new UnauthorizedError("Invalid credentials");

  const token = createJWT({ payload: createTokenUser(result) });

  const refreshToken = createRefreshJWT({ payload: createTokenUser(result) });
  await createUserRefreshToken({
    refreshToken,
    user: result._id,
  });

  return { token, refreshToken, role: result.role, email: result.email };
};

module.exports = { signin };
