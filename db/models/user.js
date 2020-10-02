const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: String,
  hashedPassword: {
    type: String,
  },
  token: String,
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
  ],
});

userSchema.virtual('password');
userSchema.pre('validate', async function () {
  if (this.password === undefined) return;
  try {
    const hash = await bcrypt.hash(this.password, 10);
    this.hashedPassword = hash;
  } catch (err) {
    console.log(err);
    throw err;
  }
});

module.exports = mongoose.model('User', userSchema);
