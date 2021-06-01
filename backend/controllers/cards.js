const Card = require("../models/card");

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) =>
      res.status(500).send({ message: `Произошла ошибка: ${err.message}` })
    );
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: `Переданы некорректные данные при создании карточки`,
        });
      }
      return res
        .status(500)
        .send({ message: `Произошла ошибка: ${err.message}` });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res
          .status(404)
          .send({ message: `Карточка с указанным _id не найдена.` });
      }
      res.send({ data: card });
    })
    .catch((err) =>
      res.status(500).send({ message: `Произошла ошибка: ${err.message}` })
    );
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((card) => {
      if (!card) {
        res.status(400).send({
          message: `Переданы некорректные данные для постановки лайка.`,
        });
      }
      res.send({ data: card });
    })
    .catch((err) =>
      res.status(500).send({ message: `Произошла ошибка: ${err.message}` })
    );
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((card) => {
      if (!card) {
        res.status(400).send({
          message: `Переданы некорректные данные для снятия лайка.`,
        });
      }
      res.send({ data: card });
    })
    .catch((err) =>
      res.status(500).send({ message: `Произошла ошибка: ${err.message}` })
    );
};
