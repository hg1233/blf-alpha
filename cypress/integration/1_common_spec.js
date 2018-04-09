describe('Common tests', function() {
    it('should render page in multiple languages', () => {
        cy.visit('/funding/programmes/national-lottery-awards-for-all-wales');

        cy.get('.qa-global-nav .qa-lang-switcher').click();

        cy.checkMetaTitles('Arian i Bawb y Loteri Genedlaethol Cymru | Cronfa Loteri Fawr');

        cy
            .get('.qa-global-nav .qa-nav-link a')
            .first()
            .should('have.text', 'Hafan');
    });

    it('should allow contrast preferences to be set', () => {
        const redirectUrl = 'http://www.google.com/';
        cy
            .request({
                url: `/contrast/high?url=${redirectUrl}`,
                followRedirects: false
            })
            .then(response => {
                expect(response.status).to.eq(302);
                expect(response.redirectedToUrl).to.eq(redirectUrl);
                cy.getCookies().then(cookies => {
                    const contrastCookie = cookies.find(_ => _.name === 'contrastMode');
                    expect(contrastCookie.value).to.eq('high');
                });
            });
    });

    it('should redirect trailing slashes', () => {
        cy.checkRedirect({
            from: '/funding/',
            to: '/funding'
        });
    });

    it('should handle aliases', () => {
        cy.checkRedirect({
            from: '/a4aengland',
            to: '/funding/programmes/national-lottery-awards-for-all-england'
        });
    });

    it('should 404 unknown routes', () => {
        cy
            .request({
                url: '/not-a-page',
                failOnStatusCode: false
            })
            .then(response => {
                expect(response.status).to.eq(404);
                expect(response.body).to.include('Error 404 | Big Lottery Fund');
            });
    });

    it('should redirect search queries to a google site search', () => {
        cy.checkRedirect({
            from: '/search?q=This is my search query',
            to: 'https://www.google.co.uk/search?q=site%3Abiglotteryfund.org.uk+This%20is%20my%20search%20query',
            isRelative: false,
            status: 302
        });

        cy.checkRedirect({
            from: '/search?lang=en-GB&amp;q=something&amp;type=All&amp;order=r',
            to: 'https://www.google.co.uk/search?q=site%3Abiglotteryfund.org.uk+something',
            isRelative: false,
            status: 302
        });
    });
});