const createFormModel = require('./create-form-model');
const { check } = require('express-validator/check');
const { castArray } = require('lodash');

const formModel = createFormModel({
    id: 'reaching-communities-idea',
    title: 'Apply For A Grant Over £10,000'
});

formModel.registerStep({
    name: 'Your Idea',
    fieldsets: [
        {
            legend: 'Your Idea',
            fields: [
                {
                    type: 'textarea',
                    name: 'your-idea',
                    label: 'Briefly explain your idea and why it’ll make a difference',
                    isRequired: true,
                    rows: 12,
                    validator: function(field) {
                        return check(field.name)
                            .escape()
                            .trim()
                            .not()
                            .isEmpty()
                            .withMessage('Please tell us your idea');
                    },
                    helpText: {
                        body: `
<p>We support organisations that share our values of being people-led, strengths-based and connected.</p>

<p>Across all of our funding in England, we are looking for ideas that cover at least one of our three priorities:</p>
<ul>
<li>Relationships – We will be looking for ideas that bring people together and strengthen relationships in and across communities.</li>
<li>Places and Spaces – We will be looking for ideas that support people to shape and sustain the places that matter to them, like a park, community centre or online network.</li>
<li>Early Action – We will be looking for ideas that support activity that empowers people to fulfil their potential, working to address problems at the earliest possible stage.</li>
</ul>
`
                    }
                }
            ]
        }
    ]
});

formModel.registerStep({
    name: 'Project Location',
    fieldsets: [
        {
            legend: 'Where will your project take place? (select all that apply)',
            fields: [
                {
                    label: 'Where will your project take place?',
                    type: 'checkbox',
                    options: [
                        {
                            label: 'North-East',
                            value: 'North-East'
                        },
                        {
                            label: 'North-West',
                            value: 'North-West'
                        },
                        {
                            label: 'Yorkshire and the Humber',
                            value: 'Yorkshire and the Humber'
                        },
                        {
                            label: 'Midlands',
                            value: 'Midlands'
                        },
                        {
                            label: 'London and South-East',
                            value: 'London and South-East'
                        },
                        {
                            label: 'Across England',
                            value: 'Across England'
                        }
                    ],
                    name: 'location',
                    validator: function(field) {
                        return check(field.name).custom(value => {
                            const values = castArray(value);
                            if (values.indexOf('Across England') !== -1 && values.length > 1) {
                                throw new Error('If you’ve selected Across England no other regions can be selected.');
                            } else {
                                return true;
                            }
                        });
                    }
                }
            ]
        }
    ]
});

formModel.registerStep({
    name: 'Your Organisation',
    fieldsets: [
        {
            legend: 'Your Organisation',
            fields: [
                {
                    type: 'text',
                    name: 'organisation-name',
                    label: 'Legal Name',
                    isRequired: true,
                    canBeDuplicated: true,
                    duplicateLabel: 'Add another organisation',
                    duplicateHelpText:
                        'If you’re working with other organisations to deliver your idea, list them below. If you don’t know yet we can discuss this later on.',
                    validator: function(field) {
                        return check(field.name)
                            .escape()
                            .trim()
                            .not()
                            .isEmpty()
                            .withMessage('First-name must be provided');
                    }
                }
            ]
        }
    ]
});

formModel.registerReviewStep({
    title: 'Check This Is Right',
    proceedLabel: 'Submit'
});

formModel.registerSuccessStep({
    title: 'We Have Received Your Idea',
    processor: function() {}
});

module.exports = formModel;