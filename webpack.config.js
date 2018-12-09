const path = require('path');

module.exports = {
    entry: {
        main: './src/bootstrap.js',
        'workers/modulator': './src/ts/workers/modulator.ts',
        'workers/integration-calculator': './src/ts/workers/integration-calculator.ts',
        'workers/gravitation-force-calculator': './src/ts/workers/gravitation-force-calculator.ts',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: 'dist/'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: 'css-loader'
            },
        ]
    },
    devtool: 'source-map'
};