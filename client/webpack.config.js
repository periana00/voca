module.exports = {
    mode: "development",
    entry: "./src/index.tsx",
    output: {
        filename: "[name].js",
        path: __dirname + "/dist"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: {
        rules: [
            { test: /\.scss$/, use: [ "style-loader", "css-loader", "sass-loader" ] },
            { test: /\.tsx?$/, loader: "ts-loader" },
        ]
    },
    devServer: {
        static: {
            directory: __dirname + '/public'
        },
        host: '0.0.0.0',
        port: 3000,
        compress: true,
        proxy: {
            "/api": "http://server:5000" // express 서버주소
        },
        historyApiFallback: true,
    },
    stats: {
        // 콘솔 로그를 최소화 합니다
        assets: false,
        colors: true,
        version: false,
        hash: false,
        timings: false,
        chunks: false,
        chunkModules: false
    },
    watchOptions: {
        aggregateTimeout: 500, // delay before reloading
        poll: 1000 // enable polling since fsevents are not supported in docker
    },
};