const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://Cats1224:Cats1224@blyn.imjii.mongodb.net/attendance?retryWrites=true&w=majority&appName=Blyn', {
    useNewUrlParser: true,  // deprecated
    useUnifiedTopology: true, // deprecated
});


const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', UserSchema);

async function createUser(username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  await user.save();
  console.log('User created');
}

createUser('admin', '1234'); // Change the values as needed
