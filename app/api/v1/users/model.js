const mongoose = require("mongoose");
const { model, Schema } = mongoose;
const bcrypt = require("bcryptjs");

const usersSchema = Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 50,
      required: [true, "Nama harus diisi"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email harus diisi"],
    },
    password: {
      type: String,
      required: [true, "Password harus diisi"],
      minlength: 5,
    },
    role: {
      type: String,
      enum: ["admin", "organizer", "owner"],
      default: "admin",
    },
    organizer: {
      type: mongoose.Types.ObjectId,
      ref: "Organizer",
      required: true,
    },
  },
  { timestamps: true }
);

// sebelum menyimpan data user ini akan custom pasword terlebih dahulu dengan bcrypt
usersSchema.pre("save", async function (next) {
  const User = this;
  if (User.isModified("password")) {
    User.password = await bcrypt.hash(User.password, 12);
  }
  next();
});

// candidatePassword digunakan untuk cek password yang dikirimkan client dengan password yang d db users
// dan mengembalikan boolean ( true OR false )
usersSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);

  return isMatch;
};

module.exports = model("User", usersSchema);
