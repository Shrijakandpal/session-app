import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: false
  },
  tags: {
    type: [String],
    default: []
  },
  json_file_url: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

const Session = mongoose.model('Session', sessionSchema);
export default Session;
