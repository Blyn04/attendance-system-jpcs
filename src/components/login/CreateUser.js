const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

// Connect to MongoDB Atlas using the environment variable
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // Ensure username is unique
    password: { type: String, required: true }, // Ensure password is provided
});

const User = mongoose.model('User', UserSchema);

async function createUser(username, password) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        console.log('User created:', username);
    } catch (err) {
        console.error('Error creating user:', err);
    }
}

// Example usage
createUser('admin', '1234'); // Change the values as needed
