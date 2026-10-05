const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const router = express.Router();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Поля 'email' и 'password' обязательны"
      });
    }

    if (!EMAIL_RE.test(String(email))) {
      return res.status(400).json({
        success: false,
        error: 'Некорректный формат email'
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Пароль должен содержать не менее 6 символов'
      });
    }

    const exists = await User.findOne({ where: { email: String(email).toLowerCase() } });
    if (exists) {
      return res.status(409).json({
        success: false,
        error: 'Пользователь с таким email уже зарегистрирован'
      });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = await User.create({
      email: String(email).toLowerCase(),
      passwordHash,
      role: 'user'
    });

    res.status(201).json({
      success: true,
      message: 'Пользователь зарегистрирован',
      data: user.toSafeJSON()
    });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        error: 'Пользователь с таким email уже зарегистрирован'
      });
    }
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Поля 'email' и 'password' обязательны"
      });
    }

    const user = await User.findOne({ where: { email: String(email).toLowerCase() } });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Неверный email или пароль'
      });
    }

    const matches = await bcrypt.compare(String(password), user.passwordHash);
    if (!matches) {
      return res.status(401).json({
        success: false,
        error: 'Неверный email или пароль'
      });
    }

    const token = signToken(user);

    res.status(200).json({
      success: true,
      message: 'Вход выполнен',
      token,
      data: user.toSafeJSON()
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
