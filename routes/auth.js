const express = require("express");
const { check, body } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.get("/reset", authController.getReset);

router.post(
    "/login",
    [
        body("email")
            .isEmail()
            .withMessage("Please enter a valid email address")
            //This is used to sanitize the email
            .normalizeEmail(),
        body("password")
            .isAlphanumeric()
            .isLength({ min: 3 })
            .withMessage("Please enter valid password")
            .trim(),
    ],
    authController.postLogin
);

router.post("/logout", authController.postLogout);

router.post("/login", authController.postLogin);

router.post(
    "/signup",
    [
        //This will check accross whole req - body,param,query,header,etc
        check("email")
            .isEmail()
            .withMessage("Please enter a valid email.")
            .custom((value, { req }) => {
                // if (value === "test@test.com") {
                //     throw new Error("This email address is forbidden.");
                // }

                // Validator finds rejected promise and adds it in the errors
                return User.findOne({ email: value }).then((userDoc) => {
                    if (userDoc) {
                        return Promise.reject(
                            "Email already exists, please pick a different one"
                        );
                    }
                });
                // return true;
            })
            .normalizeEmail(),
        //This is also allowed.Messsge with field
        //This will only check in body
        body(
            "password",
            "Please enter a password with only numbers nd text and at least 5 characters"
        )
            .isLength({ min: 2 })
            .isAlphanumeric()
            .trim(),
        body("confirmPassword").custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords have to match");
            }
            return true;
        }),
    ],
    authController.postSignup
);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
