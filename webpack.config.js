const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
/* const commonsPlugin = new webpack.optimize.CommonsChunkPlugin({
	name: 'commons', // Just name it
	filename: 'common.js' // Name of the output file
	// There are more options, but we don't need them yet.
}); */
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')

// the path(s) that should be cleaned
let pathsToClean = [
	'assets/dist/*.*',
	'build/*.*'
]
module.exports = {
	entry: {
		viewer: './web/componentViewer.js',
		editor: './web/componentEditor.js'
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
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.js$/,
				include: [path.resolve(__dirname, 'web')],
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							[
								'env',
								{
									targets: {
										browsers: ['last 2 versions', 'safari >= 7']
									}
								}
							],
							'react',
							'stage-2'
						],
						plugins: ['babel-plugin-transform-object-rest-spread'],
						babelrc: false
					}
				}
			}
		]
	},
	mode: 'development',
	plugins: [
		new CleanWebpackPlugin(pathsToClean),
		new HtmlWebpackPlugin({
			template: './web/reactNativeComponentTemplate.html',
			inject: 'body',
			filename: './reactQuillViewer-index.html',
			inlineSource: 'viewer.bundle.js',
 			chunks: ['viewer']
 		}),
		new HtmlWebpackPlugin({
			template: './web/reactNativeComponentTemplate.html',
			inject: 'body',
			filename: './reactQuillEditor-index.html',
			inlineSource: 'editor.bundle.js',
			chunks: ['editor']
 		}),

		/* new webpack.optimize.UglifyJsPlugin({
			// Eliminate comments
			comments: false,
			// Compression specific options
			compress: {
				// remove warnings
				warnings: false,
				// Drop console statements
				drop_console: true
			}
		}), */
		new HtmlWebpackInlineSourcePlugin()
	]
};
