const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = {
    entry: ['./client/src/index.tsx', './client/src/style.scss'],
    // mode: 'development',
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    output: {
        filename:'index.js',
        path: path.resolve(__dirname, '../server/public/dist'),
    },
    plugins: [ new MiniCssExtractPlugin({ filename: 'style.css' }) ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    // "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: ['@babel/plugin-proposal-object-rest-spread']
                    }
                }
            },
            {
                test: /\.tsx?$/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        configFile: path.resolve(__dirname, 'tsconfig.json'),
                        // configFile: './client/tsconfig.json',
                    }
                }],
                exclude: /node_modules/,
            },
        ],
    },
}