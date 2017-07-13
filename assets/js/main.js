'use strict';
/* global $, ga, cxApi */
const appConfig = require('../../config/content/sass.json');
const carousel = require('./modules/carousel');
const Grapnel = require('./libs/grapnel');
const router = new Grapnel({ pushState : true });
require('./modules/data.map');

const $thisScript = document.getElementById('js-script-main');

// initialise Vue
const Vue = require('./libs/vue');
Vue.options.delimiters = ['<%', '%>'];

// read tablet breakpoint from CSS config
const tabletBreakpoint = parseInt(appConfig.breakpoints.tablet.replace('px', ''));
// configure carousel - screen width: num items
let carouselBreakpointConfig = { 1: 1 };
carouselBreakpointConfig[tabletBreakpoint] = 3;

$('html').removeClass('no-js');

// detect IE to fix broken images
if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
    $('html').addClass('is-ie');
}

carousel.init({
    selector: '.js-carousel',
    perPage: carouselBreakpointConfig,
    nextSelector: '.js-carousel-next',
    prevSelector: '.js-carousel-prev',
});

const $mobileNavToggle = document.getElementById('js-mobile-nav-toggle');
$mobileNavToggle.addEventListener('click', (e) => {
    e.preventDefault();
    document.documentElement.classList.toggle('show-off-canvas');
});

const getCookieValue = function (a) {
    let b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
};

const isHighContrast = getCookieValue('contrastMode'); // @TODO get from config
if (isHighContrast === 'high') {
    $('html').addClass('contrast--high');
    $('#js-contrast-standard').show();
    $('#js-contrast-high').hide();
} else {
    $('#js-contrast-standard').hide();
    $('#js-contrast-high').show();
}

$('#js-close-overlay').on('click', () => {
    $('#js-overlay').hide();
});

// setup google analytics
const uaCode = $thisScript.getAttribute('data-ga-code');
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments);},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m);
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', uaCode, {
    'cookieDomain': 'none'
});

let ab = {
    id: $thisScript.getAttribute('data-ab-id'),
    variant: $thisScript.getAttribute('data-ab-variant')
};

if (ab.id && ab.variant) {
    console.log('tracking test', ab);
    ga('set', 'expId', ab.id);
    ga('set', 'expVar', ab.variant);
    cxApi.setChosenVariation(ab.variant, ab.id);
}

ga('send', 'pageview');

let fundingRegex = /\/funding\/funding-guidance\/managing-your-funding\/ordering-free-materials|\/funding\/test/;
router.get(fundingRegex, () => {

    let allOrderData = {};

    const vueApp = new Vue({
        el: '#js-vue',
        data: {
            orderData: allOrderData,
        },
        methods: {
            getQuantity: function (code, valueAtPageload) {
                if (this.orderData[code]) {
                    return this.orderData[code].quantity;
                } else {
                    return valueAtPageload;
                }
            },
            isEmpty: function () {
                let quantity = 0;
                for (let o in this.orderData) {
                    quantity += this.orderData[o].quantity;
                }
                return (quantity === 0);
            }
        }
    });

    $('.js-order-material-btn').on('click', function (e) {
        e.preventDefault();
        const $form = $(this).parents('form');
        const url = $form.attr('action');
        let data = $form.serialize();
        data += '&action=' + $(this).val();
        $.ajax({
            url: url,
            type: "POST",
            data: data,
            dataType: 'json',
            success: (response) => {
                allOrderData = response.allOrders;
                vueApp.orderData = Object.assign({}, vueApp.orderData, response.allOrders);
            }
        });
    });
});