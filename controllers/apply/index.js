'use strict';
const express = require('express');

const { initFormRouter } = require('./form-router');

const digitalFundForm = require('./digital-fund/form-model');
const reachingCommunitiesForm = require('./reaching-communities/form-model');
const youthCapacityForm = require('./youth-capacity/form-model');

const router = express.Router();

router.get('/', (req, res) => res.redirect('/'));
router.use('/digital-fund-strand-1', initFormRouter(digitalFundForm.strand1));
router.use('/digital-fund-strand-2', initFormRouter(digitalFundForm.strand2));
router.use('/your-idea', initFormRouter(reachingCommunitiesForm));
router.use('/youth-capacity', initFormRouter(youthCapacityForm));

module.exports = router;
