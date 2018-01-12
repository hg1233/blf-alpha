/* global describe, it */

const chai = require('chai');
const expect = chai.expect;

const httpMocks = require('node-mocks-http');
const { buildUrl, getCurrentUrl, getHtmlClasses, getMetaTitle } = require('./viewGlobals');

describe('View Globals', () => {
    describe('#buildUrl', () => {
        it('should build correct url based on section url and page name', () => {
            const builderEn = buildUrl('');
            const builderCy = buildUrl('welsh');

            expect(builderEn('toplevel', 'benefits')).to.equal('/jobs/benefits');
            expect(builderCy('toplevel', 'benefits')).to.equal('welsh/jobs/benefits');
        });

        it('should build correct url when a simple path is given', () => {
            const testPath = 'global-content/programmes/england/awards-for-all-england';
            expect(buildUrl('')(testPath)).to.equal(`/${testPath}`);
            expect(buildUrl('welsh')(testPath)).to.equal(`welsh/${testPath}`);
        });
    });

    describe('#getCurrentUrl', () => {
        it('should return expected url for en locale', () => {
            const req = httpMocks.createRequest({
                method: 'GET',
                url: '/some/example/url/',
                headers: {
                    Host: 'biglotteryfund.org.uk',
                    'X-Forwarded-Proto': 'https'
                }
            });
            expect(getCurrentUrl(req, 'en')).to.equal('https://biglotteryfund.org.uk/some/example/url');
            expect(getCurrentUrl(req, 'cy')).to.equal('https://biglotteryfund.org.uk/welsh/some/example/url');
        });

        it('should correct url if in cy locale', () => {
            expect('should return expected url for cy locale', () => {
                const req = httpMocks.createRequest({
                    method: 'GET',
                    url: '/welsh/some/example/url/',
                    headers: {
                        Host: 'biglotteryfund.org.uk',
                        'X-Forwarded-Proto': 'https'
                    }
                });

                expect(getCurrentUrl(req, 'en')).to.equal('https://biglotteryfund.org.uk/some/example/url');
                expect(getCurrentUrl(req, 'cy')).to.equal('https://biglotteryfund.org.uk/welsh/some/example/url');
            });
        });
    });

    describe('#getHtmlClasses', () => {
        it('should return expected html classes based on locale', () => {
            expect(getHtmlClasses({ locale: 'en' })).to.equal('no-js locale--en');
            expect(getHtmlClasses({ locale: 'cy' })).to.equal('no-js locale--cy');
        });

        it('should return expected html classes if in high contrast mode', () => {
            expect(getHtmlClasses({ locale: 'en', highContrast: true })).to.equal('no-js locale--en contrast--high');
            expect(getHtmlClasses({ locale: 'cy', highContrast: true })).to.equal('no-js locale--cy contrast--high');
            expect(getHtmlClasses({ locale: 'en', highContrast: false })).to.equal('no-js locale--en');
            expect(getHtmlClasses({ locale: 'cy', highContrast: false })).to.equal('no-js locale--cy');
        });
    });

    describe('#getMetaTitle', () => {
        it('should return combined meta title when page title is set', () => {
            expect(getMetaTitle('Big Lottery Fund', 'Example')).to.equal('Example | Big Lottery Fund');
        });

        it('should return base title if no page title is set', () => {
            expect(getMetaTitle('Big Lottery Fund')).to.equal('Big Lottery Fund');
        });
    });
});