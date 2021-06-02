const router = require("express").Router();

router.get("*", (req, res) => {
  res.status(404).send({
    message: "Вы пытаетесь перейти по несуществующему пути.",
  });
});

module.exports = router;
