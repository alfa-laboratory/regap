/* eslint no-var: 0, global-require: 0, import/no-extraneous-dependencies: 0 */
const path = require('path');

module.exports = function (config) {
    var webpackConfig = require('./webpack.config');

    var babelLoader = webpackConfig.module.loaders.find(loader => loader.loader === 'babel');
    babelLoader.include = [path.resolve(__dirname, 'src')];

    webpackConfig.module.loaders.push({
        test: /\.jsx?$/,
        loader: 'isparta',
        include: path.resolve(__dirname, 'src')
    });

    webpackConfig.devtool = 'inline-source-map';

    config.set({
        browsers: ['Chrome'],
        frameworks: ['mocha', 'sinon-chai', 'chai-dom', 'chai'],
        reporters: ['mocha', 'coverage', 'junit'],
        preprocessors: {
            './src/**/*.js': ['webpack', 'sourcemap']
        },
        files: [
            './node_modules/document-register-element/build/document-register-element.js',
            './src/**/*.test.js?(x)'
        ],
        plugins: [
            require('karma-webpack'),
            require('karma-chrome-launcher'),
            require('karma-firefox-launcher'),
            require('karma-safari-launcher'),
            require('karma-sourcemap-loader'),
            require('karma-mocha'),
            require('karma-sinon-chai'),
            require('karma-chai'),
            require('karma-chai-dom'),
            require('karma-mocha-reporter'),
            require('karma-junit-reporter'),
            require('karma-coverage')
        ],
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: false,
            quiet: false
        },
        coverageReporter: {
            check: {
                global: {
                    statements: 86,
                    branches: 80,
                    functions: 95,
                    lines: 40
                }
            }
        },
        junitReporter: {
            outputFile: 'test-results.xml',
            useBrowserName: false
        }
    });
};
