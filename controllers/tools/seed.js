const uuidv4 = require('uuid/v4');
const userService = require('../../services/user');
const appData = require('../../modules/appData');

function shouldMount() {
    return appData.isNotProduction && process.env.USE_LOCAL_DATABASE;
}

function init({ router }) {
    if (!shouldMount()) {
        return;
    }

    router.post('/seed/user', (req, res) => {
        const uuid = uuidv4();
        const newUser = {
            username: `${uuid}@example.com`,
            password: uuid,
            level: 5
        };

        userService.createUser(newUser).then(() => {
            res.json(newUser);
        });
    });

    return router;
}

module.exports = {
    init
};