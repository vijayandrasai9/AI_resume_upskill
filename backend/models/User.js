import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: String,
  level: Number
});

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  theme:     { type: String, default: 'light' },
  roles:     [String],
  skills:    [skillSchema],
  resumeUrl: String,
  stats: {
    projects:     { type: Number, default: 0 },
    rolesApplied: { type: Number, default: 0 },
    downloads:    { type: Number, default: 0 }
  }
});

export default mongoose.model('User', userSchema);