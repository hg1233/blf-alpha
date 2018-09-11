'use strict';
const path = require('path');
const { map } = require('lodash');
const express = require('express');

const {
    injectBreadcrumbs,
    injectFundingProgramme,
    injectFundingProgrammes
} = require('../../middleware/inject-content');
const { isBilingual } = require('../../modules/pageLogic');
const appData = require('../../modules/appData');

const { getValidLocation, programmeFilters } = require('./helpers');

const router = express.Router();

/**
 * Programmes list
 */
router.get('/', injectBreadcrumbs, injectFundingProgrammes, (req, res) => {
    const allFundingProgrammes = res.locals.fundingProgrammes || [];

    const locationParam = getValidLocation(allFundingProgrammes, req.query.location);

    const programmes = allFundingProgrammes
        // @TODO: Remove fallback condition once active programme field exists in production
        .filter(p => (p.programmeType ? p.programmeType === 'activeProgramme' : true))
        .filter(programmeFilters.filterByLocation(locationParam))
        .filter(programmeFilters.filterByMinAmount(req.query.min))
        .filter(programmeFilters.filterByMaxAmount(req.query.max));

    if (parseInt(req.query.min, 10) === 10000) {
        res.locals.breadcrumbs.push({
            label: res.locals.copy.over10k,
            url: '/over10k'
        });
    }

    if (parseInt(req.query.max, 10) === 10000) {
        res.locals.breadcrumbs.push({
            label: res.locals.copy.under10k,
            url: '/under10k'
        });
    }

    if (locationParam) {
        const globalCopy = req.i18n.__('global');
        res.locals.breadcrumbs.push({
            label: {
                england: globalCopy.regions.england,
                wales: globalCopy.regions.wales,
                scotland: globalCopy.regions.scotland,
                northernIreland: globalCopy.regions.northernIreland,
                ukWide: globalCopy.regions.ukWide
            }[locationParam]
        });
    }

    // If we have more than two breadcrumbs assign a url to the second (the current page)
    if (res.locals.breadcrumbs.length > 2) {
        res.locals.breadcrumbs[1].url = req.baseUrl;
    }

    const activeBreadcrumbsSummary = map(res.locals.breadcrumbs, 'label').join(', ');

    res.render(path.resolve(__dirname, './views/programmes-list'), {
        programmes,
        activeBreadcrumbsSummary
    });
});

/**
 * Programmes list: closed to applicants
 */
if (appData.isNotProduction) {
    router.get('/closed', injectBreadcrumbs, injectFundingProgrammes, (req, res, next) => {
        const allFundingProgrammes = res.locals.fundingProgrammes || [];
        const programmes = allFundingProgrammes.filter(p => p.programmeType === 'closedToApplicants');

        if (programmes.length > 0) {
            res.render(path.resolve(__dirname, './views/programmes-list'), {
                programmes
            });
        } else {
            next();
        }
    });
}

/**
 * Programme detail: Digital funding demo
 */
if (appData.isNotProduction) {
    router.use('/digital-funding-demo', require('./digital-fund'));
}

/**
 * Programme detail
 */
router.get('/:slug', injectFundingProgramme, (req, res, next) => {
    const entry = res.locals.fundingProgramme;

    if (entry && entry.contentSections.length > 0) {
        res.render(path.resolve(__dirname, './views/programme'), {
            entry: entry,
            title: entry.summary.title,
            heroImage: entry.hero || res.locals.fallbackHeroImage,
            isBilingual: isBilingual(entry.availableLanguages)
        });
    } else {
        next();
    }
});

module.exports = router;
