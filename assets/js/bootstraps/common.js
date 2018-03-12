'use strict';

/**
 * Common modules that are run accross the site.
 * (Non-Vue components)
 */
const global = require('../modules/global');
const tabs = require('../modules/tabs');
const heroImages = require('../modules/heroImages');
const logos = require('../modules/logos');
const forms = require('../modules/forms');
import carousel from '../modules/carousel';

function init() {
    global.init();
    tabs.init();
    heroImages.init();
    logos.init();
    forms.init();
    carousel.init();
}

export default {
    init
};