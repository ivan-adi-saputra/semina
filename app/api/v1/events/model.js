const mongoose = require("mongoose");
const { model, Schema } = mongoose;

// tiket dijadikan 1 model karena tiket sudah pasti milik event
// cth: 1 event bisa memiliki 5 ticket atau lebih, dan 1 tiket tidak bisa memiliki banyak event
const ticketCategoriesSchema = Schema({
  type: {
    type: String,
    requred: [true, "Tipe tiket harus di isi"],
  },
  price: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    default: 0,
  },
  statusTicketCategories: {
    type: Boolean,
    enum: [true, false],
    default: true,
  },
  expired: {
    type: Date,
  },
});

const eventSchema = Schema(
  {
    title: {
      type: String,
      required: [true, "Nama event harus diisi"],
      minlength: 3,
      maxlength: 50,
    },
    date: {
      type: Date,
      required: [true, "Tanggal dan Waktu harus diisi"],
    },
    about: {
      type: String,
    },
    tagline: {
      type: String,
      required: [true, "Tagline event harus diisi"],
    },
    keyPoint: {
      type: [String],
    },
    venueName: {
      type: String,
      required: [true, "Tempat acara harus diisi"],
    },
    statusEvent: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Draft",
    },
    tickets: {
      type: [ticketCategoriesSchema],
    },
    image: {
      type: mongoose.Types.ObjectId,
      ref: "Image",
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    talent: {
      type: mongoose.Types.ObjectId,
      ref: "Talent",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Event", eventSchema);
