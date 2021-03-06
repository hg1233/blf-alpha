'use strict';
const { get, isArray } = require('lodash');

const HUB_EMAILS = {
    england: 'englandteam@tnlcommunityfund.org.uk',
    londonSouthEast: 'londonandsoutheastteam@tnlcommunityfund.org.uk',
    midlands: 'midlandsteam@tnlcommunityfund.org.uk',
    northEastCumbria: 'neandcumbriateam@tnlcommunityfund.org.uk',
    northWest: 'northwestteam@tnlcommunityfund.org.uk',
    southWest: 'southwestteam@tnlcommunityfund.org.uk',
    yorksHumber: 'yorksandhumberteam@tnlcommunityfund.org.uk'
};

const PROJECT_LOCATIONS = [
    {
        value: 'North East & Cumbria',
        email: HUB_EMAILS.northEastCumbria
    },
    {
        value: 'North West',
        email: HUB_EMAILS.northWest
    },
    {
        value: 'Yorkshire and the Humber',
        email: HUB_EMAILS.yorksHumber
    },
    {
        value: 'South West',
        email: HUB_EMAILS.southWest
    },
    {
        value: 'London and South East',
        email: HUB_EMAILS.londonSouthEast
    },
    {
        value: 'Midlands',
        email: HUB_EMAILS.midlands
    }
];

const DEFAULT_EMAIL = HUB_EMAILS.england;

/**
 * Determine which internal address to send to:
 * - If multi-region, send to default/england-wide inbox
 * - Otherwise send to the matching inbox for the selected region
 */
function determineInternalSendTo(location) {
    if (isArray(location)) {
        return DEFAULT_EMAIL;
    } else {
        const matchedLocation = PROJECT_LOCATIONS.find(l => l.value === location);
        return get(matchedLocation, 'email', DEFAULT_EMAIL);
    }
}

module.exports = {
    DEFAULT_EMAIL,
    PROJECT_LOCATIONS,
    determineInternalSendTo
};
