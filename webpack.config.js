/**
 * External dependencies
 */
const get = require( 'lodash/get' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

// Remove DependencyExtractionWebpackPlugin since we want all dependencies to be bundled.
const plugins = defaultConfig.plugins.filter( ( plugin ) => get( plugin, 'constructor.name' ) !== 'DependencyExtractionWebpackPlugin' );

module.exports = {
	...defaultConfig,
	plugins,
};
