const crypto = require("crypto");

const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const User = require("../models/user");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "sachin.iyer@wearealef.com",
        pass: "ygoprxmvavwkvtsd",
    },
});

exports.getLogin = (req, res, next) => {
    // let pog = new Map();
    // for (item of req.get("Cookie").split(";")) {
    //     pog[item.trim().split("=")[0]] = item.trim().split("=")[1];
    // }
    // console.log(pog);
    // console.log(pog["isLoggedIn"]);

    // console.log(req.flash("error")[0].toString());
    let message = req.flash("error");
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        errorMessage: message,
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                req.flash("error", "Invalid email or password.");
                return res.redirect("/login");
            }
            bcrypt
                .compare(password, user.password)
                .then((doMatch) => {
                    if (doMatch) {
                        //This is imp.. req.session.user is checked every time we hit a req
                        //Session is formed every time.. but user & flag insert only at time of login
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save((err) => {
                            console.log(err);
                            res.redirect("/");
                        });
                    }
                    return res.redirect("/login");
                })
                .catch((err) => {
                    console.log(err);
                    res.redirect("/login");
                });
        })
        .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect("/");
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({ email: email })
        .then((userDoc) => {
            if (userDoc) {
                req.flash(
                    "error",
                    "E-Mail exists already, please pick a different one."
                );
                return res.redirect("/signup");
            }
            return bcrypt
                .hash(password, 12)
                .then((hashedPassword) => {
                    const user = new User({
                        email: email,
                        password: hashedPassword,
                        cart: { items: [] },
                    });
                    return user.save();
                })
                .then((result) => {
                    res.redirect("/login");
                    return transporter.sendMail({
                        to: "sachin.iyer@wearealef.com",
                        from: "shop@node-complete.com",
                        subject: "Signup succeeded!",
                        html: "<h1>You successfully signed up!</h1>",
                    });
                });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getSignup = (req, res, next) => {
    let message = req.flash("error");
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render("auth/signup", {
        path: "/signup",
        pageTitle: "Signup",
        isAuthenticated: false,
        errorMessage: message,
    });
};

exports.getReset = (req, res, next) => {
    let message = req.flash("error");
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render("auth/reset", {
        path: "/reset",
        pageTitle: "Reset Password",
        isAuthenticated: false,
        errorMessage: message,
    });
};

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect("/reset");
        }
        const token = buffer.toString("hex");
        User.findOne({ email: req.body.email })
            .then((user) => {
                if (!user) {
                    req.flash("error", "No Account with that email found.");
                    return res.redirect("/reset");
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then((result) => {
                res.redirect("/login");
                return transporter.sendMail({
                    to: "sachin.iyer@wearealef.com",
                    from: "shop@node-complete.com",
                    subject: "Password Reset",
                    html: `<p>You requested password reset</p>
                    <p>Click this <a href="http://localhost:3000/reset/${token}">link</a></p>`,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    });
};

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() },
    })
        .then((user) => {
            let message = req.flash("error");
            if (message.length > 0) {
                message = message[0];
            } else {
                message = null;
            }
            res.render("auth/new-password", {
                path: "/new-password",
                pageTitle: "New Password",
                isAuthenticated: false,
                errorMessage: message,
                userId: user._id.toString(),
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    User.findById(userId)
        .then((user) => {
            if (!user) {
                //...
            }
            // const newUser = { ...user };
            // newUser["password"] = newPassword
            return bcrypt
                .hash(newPassword, 12)
                .then((hashedPassword) => {
                    // newUser["password"] = hashedPassword;
                    // const user1 = new User({
                    //     email: newUser["email,
                    //     password: hashedPassword,
                    //     cart: { items: [] },
                    // });
                    user.resetToken = undefined;
                    user.resetTokenExpiration = undefined;
                    user.password = hashedPassword
                    return user.save();
                })
                .then((result) => {
                    res.redirect("/login");
                    return transporter.sendMail({
                        to: "sachin.iyer@wearealef.com",
                        from: "shop@node-complete.com",
                        subject: "Password Changed!",
                        html: "<h1>You changed password!</h1>",
                    });
                });
        })
        .catch((err) => {
            console.log(err);
        });
};
