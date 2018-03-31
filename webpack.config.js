const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const commonsPlugin = new webpack.optimize.CommonsChunkPlugin({
	name: 'commons', // Just name it
	filename: 'common.js' // Name of the output file
	// There are more options, but we don't need them yet.
});
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')

// the path(s) that should be cleaned
let pathsToClean = [
  'assets/dist/index.html',
  'build'
]
module.exports = {
	entry: {
		editor: './web/componentEditor.js',
		viewer: './web/componentViewer.js'
	},
	output: {
		path: path.join(__dirname, './build'),
		filename: '[name].bundle.js'
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [ 'style-loader', 'css-loader' ]
			},
			{
				test: /\.js$/,
				include: [ path.resolve(__dirname, 'web') ],
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							[
								'env',
								{
									targets: {
										browsers: [ 'last 2 versions', 'safari >= 7' ]
									}
								}
							],
							'react',
							'stage-2'
						],
						plugins: [ 'babel-plugin-transform-object-rest-spread' ],
						babelrc: false
					}
				}
			}
		]
	},

	plugins: [
		new CleanWebpackPlugin(pathsToClean),
		new HtmlWebpackPlugin({
			inlineSource: '(common.js|editor.bundle.js)',
			template: './web/reactNativeComponentTemplate.html',
			chunks: [ 'editor', 'commons' ],
			inject: 'body',
			filename: './reactQuillEditor-index.html'
		}),
		new HtmlWebpackPlugin({
			inlineSource: '(common.js|viewer.bundle.js)',
			template: './web/reactNativeComponentTemplate.html',
			chunks: [ 'viewer', 'commons' ],
			inject: 'body',
			filename: './reactQuillViewer-index.html'
		}),
		commonsPlugin,
		new HtmlWebpackInlineSourcePlugin(),
		new CopyWebpackPlugin([
			{
				from: path.join(__dirname, './build/*.html'),
				to: path.join(__dirname, '/assets/dist'),
				toType: 'dir',
				flatten: true
			}
		])
	]
};
