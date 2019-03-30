const mix = require('laravel-mix');
let LiveReloadPlugin = require('webpack-livereload-plugin');

mix.js('src/js/main.js', 'public')
    .autoload({jquery: ['$', 'window.jQuery', 'jQuery']})
    .sass('src/styles/main.scss', 'public')
    .webpackConfig({
    plugins: [
        new LiveReloadPlugin()
    ]
});