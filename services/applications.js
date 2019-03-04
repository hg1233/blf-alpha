'use strict';
const moment = require('moment');
const { Op } = require('sequelize');

const { Application } = require('../models');

function makeTitle(formId) {
    return `${formId} - ${moment().toISOString()}`;
}

function createApplication({ userId, formId, title = null }) {
    if (!title) {
        title = makeTitle(formId);
    }
    return Application.create({
        user_id: userId,
        form_id: formId,
        application_title: title,
        application_data: ''
    });
}

function getApplicationsForUser(userId, formId) {
    return Application.findAll({
        where: {
            user_id: {
                [Op.eq]: userId
            },
            form_id: {
                [Op.eq]: formId
            }
        },
        order: [['updatedAt', 'DESC']]
    });
}

function getApplicationById(formId, id) {
    return Application.findOne({
        where: {
            id: {
                [Op.eq]: id
            },
            form_id: {
                [Op.eq]: formId
            }
        }
    });
}

function updateApplication(id, data) {
    return Application.update(
        {
            application_data: data
        },
        {
            where: {
                id: {
                    [Op.eq]: id
                }
            }
        }
    );
}

/* @TODO
 *
 * functions to update/retrieve application state
 */

module.exports = {
    createApplication,
    getApplicationsForUser,
    getApplicationById,
    updateApplication
};
