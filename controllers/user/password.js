const xss = require('xss');
const jwt = require('jsonwebtoken');

const models = require('../../models/index');
const mail = require('../../modules/mail');
const secrets = require('../../modules/secrets');
const { userBasePath, userEndpoints, makeUserLink, renderUserError } = require('./utils');

const requestResetForm = (req, res) => {
    res.cacheControl = { maxAge: 0 };
    res.render('user/resetpassword', {
        mode: 'enterEmail',
        makeUserLink: makeUserLink
    });
};

const changePasswordForm = (req, res) => {
    res.cacheControl = { maxAge: 0 };
    let token = req.query.token;
    if (!token) {
        return res.redirect(userBasePath + userEndpoints.login);
    }

    // a user has followed a reset link
    jwt.verify(token, secrets['user.jwt.secret'], (err, decoded) => {
        if (err) {
            console.error('Password reset token expired', err);
            req.flash('genericError', 'Your password reset period has expired - please try again');
            return renderUserError(null, req, res, userEndpoints.resetpassword);
        } else {
            if (decoded.data.reason === 'resetpassword') {
                // we can now show the reset password form
                res.render('user/resetpassword', {
                    mode: 'pickNewPassword',
                    token: token,
                    makeUserLink: makeUserLink
                });
            } else {
                console.error('Password reset token invalid', err);
                req.flash('genericError', 'Your password reset link was invalid - please try again');
                return renderUserError(null, req, res, userEndpoints.resetpassword);
            }
        }
    });
};

const sendResetEmail = (req, res) => {
    // the user wants to trigger a reset email
    const email = xss(req.body.username);
    if (!email) {
        req.flash('genericError', 'Please provide a valid email address');
        return renderUserError(null, req, res, userEndpoints.resetpassword);
    } else {
        models.Users
            .findOne({
                where: {
                    username: email
                }
            })
            .then(user => {
                if (!user) {
                    // no user found / user not in password reset mode
                    req.flash('genericError', 'Please provide a valid email address');
                    return renderUserError(null, req, res, userEndpoints.resetpassword);
                } else {
                    // this user exists, send email
                    let token = jwt.sign(
                        {
                            data: {
                                userId: user.id,
                                reason: 'resetpassword'
                            }
                        },
                        secrets['user.jwt.secret'],
                        {
                            expiresIn: '1h' // short-lived token
                        }
                    );

                    let resetPath = makeUserLink('resetpassword');
                    let resetUrl = `${req.protocol}://${req.headers.host}${resetPath}?token=${token}`;

                    mail.send(
                        'Reset the password for your Big Lottery Fund website account',
                        `Please click the following link to reset your password: ${resetUrl}`,
                        email
                    );

                    // mark this user as in password reset mode
                    models.Users
                        .update(
                            {
                                is_password_reset: true
                            },
                            {
                                where: {
                                    id: user.id
                                }
                            }
                        )
                        .then(() => {
                            req.flash('passwordRequestSent', true);
                            req.session.save(() => {
                                res.redirect(userBasePath + userEndpoints.login);
                            });
                        })
                        .catch(err => {
                            console.error('Error marking user as in password reset mode', err);
                            req.flash('genericError', 'There was an error requesting your password reset');
                            return renderUserError(null, req, res, userEndpoints.resetpassword);
                        });
                }
            })
            .catch(err => {
                // error on user lookup
                console.error('Error looking up user', err);
                req.flash('genericError', 'There was an error fetching your details');
                return renderUserError(null, req, res, userEndpoints.resetpassword);
            });
    }
};

const updatePassword = (req, res) => {
    let changePasswordToken = req.body.token;

    if (!changePasswordToken) {
        res.redirect(userBasePath + userEndpoints.login);
    } else {
        // @TODO enforce password constraints
        if (!req.body.password) {
            // @TODO include the token here
            req.flash('genericError', 'Please choose a valid password');
            return renderUserError(null, req, res, userEndpoints.resetpassword);
        } else {
            // check the token again
            jwt.verify(changePasswordToken, secrets['user.jwt.secret'], (err, decoded) => {
                if (err) {
                    console.error('Password reset token expired', err);
                    req.flash('genericError', 'Your password reset period has expired - please try again');
                    // @TODO include the token here
                    return renderUserError(null, req, res, userEndpoints.resetpassword);
                } else {
                    if (decoded.data.reason === 'resetpassword') {
                        // is this user in password update mode?
                        models.Users
                            .findOne({
                                where: {
                                    id: decoded.data.userId,
                                    is_password_reset: true
                                }
                            })
                            .then(user => {
                                if (!user) {
                                    // no user for this ID, or they already did this reset
                                    console.error('A user tried to reset a password using a pre-used token');
                                    req.flash(
                                        'genericError',
                                        'There was an error updating your password - please try again'
                                    );
                                    // @TODO include the token here
                                    return renderUserError(null, req, res, userEndpoints.resetpassword);
                                } else {
                                    // this user exists and requested this change
                                    let newPassword = req.body.password;
                                    models.Users
                                        .update(
                                            {
                                                password: newPassword,
                                                is_password_reset: false
                                            },
                                            {
                                                where: {
                                                    id: decoded.data.userId
                                                }
                                            }
                                        )
                                        .then(() => {
                                            req.flash('passwordUpdated', true);
                                            req.session.save(() => {
                                                res.redirect(userBasePath + userEndpoints.login);
                                            });
                                        })
                                        .catch(err => {
                                            console.error('Error updating a user password', err);
                                            req.flash(
                                                'genericError',
                                                'There was an error updating your password - please try again'
                                            );
                                            // @TODO include the token here
                                            return renderUserError(null, req, res, userEndpoints.resetpassword);
                                        });
                                }
                            })
                            .catch(err => {
                                console.error('Error fetching a user password change status', err);
                                req.flash(
                                    'genericError',
                                    'There was an error updating your password - please try again'
                                );
                                // @TODO include the token here
                                return renderUserError(null, req, res, userEndpoints.resetpassword);
                            });
                    } else {
                        console.error('A user tried to reset a password with an invalid token');
                        req.flash('genericError', 'There was an error updating your password - please try again');
                        // @TODO include the token here
                        return renderUserError(null, req, res, userEndpoints.resetpassword);
                    }
                }
            });
        }
    }
};

module.exports = {
    requestResetForm,
    sendResetEmail,
    changePasswordForm,
    updatePassword
};
