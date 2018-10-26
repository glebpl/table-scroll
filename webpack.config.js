const path = require('path');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

let styleLoaders = [
    "style-loader",
    {
        loader: "css-loader",// translates CSS into CommonJS
        options: {
            sourceMap: !isProd
        }
    }
];

if(isProd) {
    styleLoaders = styleLoaders.concat({
        loader: 'postcss-loader', options: {
            plugins: [require('cssnano')({
                safe: true
            })]
        }
    });
}

styleLoaders = styleLoaders.concat({
    loader: "sass-loader",
    options: {
        sourceMap: !isProd
    }
});

module.exports = {
    mode: nodeEnv,
    devtool: isProd ? "none" : "inline-source-map",
    target: "web",
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: `table-scroll${!isProd ? '.dev' : ''}.js`,
        library: "TableScroll",
        libraryTarget: "umd"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }, {
                test: /\.scss$/,
                use: styleLoaders
            }
        ]
    }
};