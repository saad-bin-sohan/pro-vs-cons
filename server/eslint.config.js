const js = require('@eslint/js');
const globals = require('globals');
const { defineConfig, globalIgnores } = require('eslint/config');

module.exports = defineConfig([
    globalIgnores(['node_modules']),
    {
        files: ['**/*.js'],
        extends: [js.configs.recommended],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'commonjs',
            globals: globals.node,
        },
        rules: {
            // Express's error-handling middleware is identified by
            // function arity (err, req, res, next) — `next` must stay
            // declared even where it's unused. Same underscore escape
            // hatch the client config uses for intentionally-unused
            // bindings, applied to args instead of vars here.
            'no-unused-vars': ['error', { args: 'after-used', argsIgnorePattern: '^_' }],
        },
    },
]);
