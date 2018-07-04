/* eslint-env jest */
'use strict';
const config = require('config');
const {
    CONTENT_TYPES,
    createSection,
    customRoute,
    sessionRoute,
    staticContentRoute,
    basicContentRoute,
    flexibleContentRoute,
    legacyRoute
} = require('./route-types');

describe('Route types', () => {
    it('should create a new section', () => {
        const section = createSection({
            path: '/example',
            langTitlePath: 'global.nav.about'
        });

        section.addRoutes({
            exampleSection: customRoute({
                path: '/some/url'
            })
        });

        expect(section.path).toBe('/example');
        expect(section.find('exampleSection')).toBe('/example/some/url');
        expect(() => section.find('doesNotExist')).toThrowError('No route found for doesNotExist');
    });

    it('should define a custom route schema', () => {
        const route = customRoute({ path: '/some/url', queryStrings: ['foo', 'bar'] });
        expect(route).toEqual({
            path: '/some/url',
            isPostable: false,
            live: true,
            queryStrings: ['foo', 'bar']
        });
    });

    it('should define a session route schema', () => {
        const route = sessionRoute({ path: '/some/url' });
        expect(route).toEqual({
            path: '/some/url',
            isPostable: true,
            cookies: [config.get('cookies.session')],
            live: true
        });
    });

    it('should define a static content route schema', () => {
        const route = staticContentRoute({ path: '/some/url' });
        expect(route).toEqual({
            contentType: CONTENT_TYPES.STATIC,
            isPostable: false,
            path: '/some/url',
            live: true
        });
    });

    it('should define a basic content route schema', () => {
        const route = basicContentRoute({ path: '/some/url' });
        expect(route).toEqual({
            contentType: CONTENT_TYPES.CMS_BASIC,
            isPostable: false,
            path: '/some/url',
            live: true
        });
    });

    it('should define a flexible content route schema', () => {
        const route = flexibleContentRoute({ path: '/some/url' });
        expect(route).toEqual({
            contentType: CONTENT_TYPES.CMS_FLEXIBLE_CONTENT,
            isPostable: false,
            path: '/some/url',
            live: true
        });
    });

    it('should define a legacy schema', () => {
        const route = legacyRoute({ path: '/some/url' });
        expect(route).toEqual({
            path: '/some/url',
            isPostable: true,
            allowAllQueryStrings: true,
            live: true
        });
    });
});
