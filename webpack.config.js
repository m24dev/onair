const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const URL = '/special/onair/';

module.exports = env => {
    let mode = env.mode;
    const isDev = mode === 'development' ? true : false;
    return {
        entry: './src/js/widget.js',
        output: {
            filename: 'js/[name].[contenthash].js',
            publicPath: isDev ? '/' : URL
        },
        optimization: {
            minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
        },
        devServer: {
            contentBase: path.resolve(__dirname, 'src'),
        },
        devtool: isDev ? 'cheap-module-source-map' : 'none',
        mode,
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    use: {
						loader: 'babel-loader'
					}
				},
                {
                    test: /\.css$/,
                    use: [
                        {
							loader: MiniCssExtractPlugin.loader,
							options: {
								hmr: isDev,
								publicPath: '../'
							},
						},
                        'css-loader',                    ]
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                outputPath: 'images',
                                name: '[name].[ext]'
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: './src/widget.html',
                filename: isDev ? 'index.html' : 'onAirWidget.html.ep',
                isDev: isDev,
                inject: false
            }),
            new MiniCssExtractPlugin({
				filename: 'css/[name].[contenthash].css'
			})
        ]
    }
}