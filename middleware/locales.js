'use strict';

const i18n = require('i18n-2');
const config = require('config');
const routes = require('../controllers/routes');

module.exports = function(app) {
    const setViewGlobal = (name, value) => {
        return app.get('engineEnv').addGlobal(name, value);
    };

    // setup internationalisation
    i18n.expressBind(app, {
        locales: ['en', 'cy'],
        cookieName: 'locale',
        extension: '.json',
        directory: './config/locales',
        devMode: false
    });

    function overlayMiddleware(req, res, next) {
        if (req.flash('showOverlay')) {
            setViewGlobal('showOverlay', true);
        } else {
            setViewGlobal('showOverlay', false);
        }
        next();
    }

    function localeMiddleware(req, res, next) {
        const WELSH_LOCALE = 'cy';
        const CYMRU_URL = /^\/welsh(\/|$)/;
        const IS_WELSH = req.url.match(CYMRU_URL) !== null;
        let localePrefix = '';

        if (IS_WELSH) {
            req.i18n.setLocale(WELSH_LOCALE);
            res.setHeader('Content-Language', WELSH_LOCALE);
            localePrefix = config.get('i18n.urlPrefix.cy');
        }

        // store locale prefs globally
        setViewGlobal('locale', req.i18n.getLocale());
        setViewGlobal('localePrefix', localePrefix);

        // get a11y contrast preferences
        let contrastPref = req.cookies[config.get('cookies.contrast')];
        if (contrastPref && contrastPref === 'high') {
            setViewGlobal('highContrast', true);
        } else {
            setViewGlobal('highContrast', false);
        }

        return next();
    }

    // get routes / current section
    function routesMiddleware(req, res, next) {
        setViewGlobal('routes', routes.sections);
        return next();
    }

    // add the request object as a local variable
    // for URL rewriting in templates
    // (eg. locale versions, high-contrast redirect etc)
    function requestMiddleware(req, res, next) {
        res.locals.request = req;
        return next();
    }

    return [overlayMiddleware, localeMiddleware, routesMiddleware, requestMiddleware];
};
