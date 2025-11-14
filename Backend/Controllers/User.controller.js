import User from '../Models/User.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// login

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ismatch = await bcrypt.compare(password, user.password);
    if (!ismatch)
      return res.status(400).json({ message: 'ivalid credentials' });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: '24h',
      }
    );

    res.status(200).send({ token: token, message: 'user logedin', user: user });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'internal server error' });
  }
};

// sign up

export const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newuser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'student',
    });

    await newuser.save();

    res
      .status(200)
      .send({ message: 'registered in successfully', user: newuser });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'internal server error' });
  }
};
