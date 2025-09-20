const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const categoriesEnum = ["sports", "finance", "politics", "entertainment", "technology","general"];

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  categories: {
    type: [String],
    enum: categoriesEnum,
    default: "general",
  },
  avatar: { type: String, default: "" }, // profile picture
}, { timestamps: true });

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model("User", userSchema);
