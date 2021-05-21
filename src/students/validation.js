import { body } from "express-validator";

export const reviewValidation = [
  body("comment").exists().withMessage("Comment is a mandatory field!"),

  body("rate")
    .exists()
    .withMessage("Rate is a mandatory field!")
    .isInt()
    .withMessage("Rate must be an integer!"),

    body("id")
    .exists()
    .withMessage("id is a mandatory field!")
    .isInt()
    .withMessage("id must be an integer!"),
];
