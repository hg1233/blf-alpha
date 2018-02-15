'use strict';

const chai = require('chai');
chai.use(require('chai-http'));
const expect = chai.expect;

const helper = require('../helper');

describe('Legacy pages', () => {
    let server;

    before(done => {
        helper.before(serverInstance => {
            server = serverInstance;
            done();
        });
    });

    after(() => {
        helper.after(server);
    });

    function requestRedirect(urlPath) {
        return chai
            .request(server)
            .get(urlPath)
            .redirects(0)
            .catch(err => err.response);
    }

    it('should redirect old funding finder', () => {
        function fundingFinderRequest({ originalPath, redirectedPath }) {
            return requestRedirect(originalPath).then(res => {
                return {
                    res,
                    originalPath,
                    redirectedPath
                };
            });
        }

        return Promise.all([
            fundingFinderRequest({
                originalPath: '/funding/funding-finder',
                redirectedPath: '/funding/programmes'
            }),
            fundingFinderRequest({
                originalPath: '/Home/Funding/Funding Finder',
                redirectedPath: '/funding/programmes'
            }),
            fundingFinderRequest({
                originalPath: '/funding/funding-finder?area=northern+ireland',
                redirectedPath: '/funding/programmes?location=northernIreland'
            }),
            fundingFinderRequest({
                originalPath: '/funding/funding-finder?area=England&amount=up to 10000',
                redirectedPath: '/funding/programmes?location=england&max=10000'
            }),
            fundingFinderRequest({
                originalPath: '/funding/funding-finder?area=Scotland&amp;amount=10001%20-%2050000',
                redirectedPath: '/funding/programmes?location=scotland&min=10000'
            }),
            fundingFinderRequest({
                originalPath: '/funding/funding-finder?cpage=1&area=uk-wide',
                redirectedPath: '/funding/programmes?location=ukWide'
            }),
            fundingFinderRequest({
                originalPath:
                    '/funding/funding-finder?area=Wales&amp;amount=up to 10000&amp;org=Voluntary or community organisation',
                redirectedPath: '/funding/programmes?location=wales&max=10000'
            })
        ]).then(results => {
            results.forEach(result => {
                expect(result.res.status).to.equal(301);
                expect(result.res).to.redirectTo(result.redirectedPath);
            });
        });
    });

    it('should proxy old funding finder if requesting closed programmes', () => {
        return chai
            .request(server)
            .get('/funding/funding-finder?area=England&amp;amount=500001 - 1000000&amp;sc=1')
            .then(res => {
                expect(res).to.have.header('X-BLF-Legacy', 'true');
                expect(res.text).to.include('This is a list of our funding programmes');
                expect(res.text).to.include('Show closed programmes');
                expect(res.status).to.equal(200);
            });
    });

    it('should redirect archived pages to the national archives', () => {
        const urlPath = '/funding/funding-guidance/applying-for-funding/aims-and-outcomes';
        return requestRedirect(urlPath).then(res => {
            expect(res.status).to.equal(301);
            expect(res).to.redirectTo(
                `http://webarchive.nationalarchives.gov.uk/*/https://www.biglotteryfund.org.uk${urlPath}`
            );
        });
    });

    it('Should redirect top-level ~/link.aspx urls', () => {
        return chai
            .request(server)
            .get('/~/link.aspx?_id=50fab7d4b5a248f8a8c8f5d4d33f9e0f&_z=z')
            .redirects(0)
            .catch(err => err.response)
            .then(res => {
                expect(res.status).to.equal(301);
                expect(res).to.redirectTo(
                    '/global-content/programmes/england/building-better-opportunities/guide-to-delivering-european-funding'
                );
            });
    });

    it('Should redirect wildcard ~/link.aspx urls', () => {
        return chai
            .request(server)
            .get('/global-content/programmes/england/~/link.aspx?_id=50FAB7D4B5A248F8A8C8F5D4D33F9E0F&_z=z')
            .redirects(0)
            .catch(err => err.response)
            .then(res => {
                expect(res.status).to.equal(301);
                expect(res).to.redirectTo(
                    '/global-content/programmes/england/building-better-opportunities/guide-to-delivering-european-funding'
                );
            });
    });

    it('should follow redirects on the legacy site', () => {
        return chai
            .request(server)
            .get('/welshlanguage')
            .redirects(0)
            .catch(err => err.response)
            .then(res => {
                expect(res.status).to.equal(301);
                expect(res).to.redirectTo(
                    '/about-big/customer-service/welsh-language-scheme'
                );
            });
    });
});
