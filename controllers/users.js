const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) =>
      res.status(500).send({ message: `Произошла ошибка: ${err.message}` })
    );
};

module.exports.getInfoProfile = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        res
          .status(404)
          .send({ message: "Пользователь с указанным _id не найден." });
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при обновлении профиля.",
        });
      }
      return res
        .status(500)
        .send({ message: `Произошла ошибка: ${err.message}` });
    });
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        return res.send({ data: user });
      }
      return res
        .status(404)
        .send({ message: "Пользователь по указанному _id не найден." });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({
          message: "Передан некорректный идентификатор пользователя.",
        });
      }
      return res
        .status(500)
        .send({ message: `Произошла ошибка: ${err.message}` });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при создании пользователя.",
        });
      }
      return res
        .status(500)
        .send({ message: `Произошла ошибка: ${err.message}` });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Неправильные почта или пароль"));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          // хеши не совпали — отклоняем промис
          return Promise.reject(new Error("Неправильные почта или пароль"));
        }

        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
          { expiresIn: "7d" }
        );
        return res
          .cookie("jwt", token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
          })
          .send({ message: "Вы успешно авторизованны!" });
      });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      if (!user) {
        res
          .status(404)
          .send({ message: "Пользователь с указанным _id не найден." });
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при обновлении профиля.",
        });
      }
      return res
        .status(500)
        .send({ message: `Произошла ошибка: ${err.message}` });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      if (!user) {
        res
          .status(404)
          .send({ message: "Пользователь с указанным _id не найден." });
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при обновлении профиля.",
        });
      }
      return res
        .status(500)
        .send({ message: `Произошла ошибка: ${err.message}` });
    });
};
