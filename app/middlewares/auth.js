const { UnauthorizedError, UnauthenticatedError } = require("../errors");
const { isTokenValid } = require("../utils/jwt");

const authenticatedUser = async (req, res, next) => {
  try {
    let token;
    // check header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    }

    if (!authHeader) throw new UnauthenticatedError("Authentication invalid");

    const payload = isTokenValid({ token });

    req.user = {
      email: payload.email,
      role: payload.role,
      name: payload.name,
      organizer: payload.organizer,
      id: payload.userId,
    };

    next();
  } catch (error) {
    next(error);
  }
};

const authenticateParticipant = async (req, res, next) => {
  try {
    let token;
    // check header
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      throw new UnauthenticatedError("Authentication invalid");
    }

    const payload = isTokenValid({ token });

    // Attach the user and his permissions to the req object
    req.participant = {
      email: payload.email,
      lastName: payload.lastName,
      firstName: payload.firstName,
      id: payload.participantId,
    };

    next();
  } catch (error) {
    next(error);
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      throw new UnauthorizedError("Unauthorized to access this route");

    next();
  };
};

module.exports = { authenticatedUser, authorizeRoles, authenticateParticipant };
