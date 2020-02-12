const webpack = require('webpack');
const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackMerge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const {GenerateSW} = require('workbox-webpack-plugin');


// const webcomponentsjs = './node_modules/@webcomponents/webcomponentsjs';


const assets = [
  {
    from: 'src/img',
    to: 'img/'
  }
];
const prodPlugins = [
  new WebpackPwaManifest({
    name: 'Conduit LitElement + MobX',
    short_name: 'RealWorld-Lit-MobX',
    description: 'The RealWorld "Conduit" website made with LitElement, MobX and Slick Router',
    background_color: '#fff',
    theme_color: '#5CB85C',
    start_url: "/",
    icons: [
      {
        src: resolve('src/img/icons/favicon.png'),
        sizes: [192, 512] // multiple sizes
      }
    ]
  }),

  new GenerateSW({
    swDest: 'sw.js',
    include: [/\.html$/, /\.js$/, /\.css$/, /\.jpg$/, /\.png$/, /\.ico$/],
    runtimeCaching: [{
      urlPattern: new RegExp('https://demo.productionready.io'),
      handler: 'staleWhileRevalidate'
    }, {
      urlPattern: new RegExp('https://conduit.productionready.io'),
      handler: 'networkFirst'
    }]
  }),
];
const devPlugins = [
  new CleanWebpackPlugin(['dist']),
  new webpack.ProgressPlugin(),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: './public/index.html',
    minify: {
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true
    }
  }),
  new CopyWebpackPlugin([...assets], {
    ignore: ['.DS_Store']
  }),
];

module.exports = ({mode, presets}) => {
  let activePlugins = [];
  if (mode === "production") {
    activePlugins = [...devPlugins, ...prodPlugins];
  } else if (mode === "development") {
    activePlugins = devPlugins;
  }

  return webpackMerge(
    {
      mode,
      output: {
        filename: '[name].[chunkhash:8].js'
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
              plugins: [
                ["@babel/plugin-proposal-decorators", { "legacy": true }],
                ["@babel/plugin-proposal-class-properties", { "loose": true }],
                "@babel/plugin-syntax-dynamic-import"
              ],              presets: [
                [
                  '@babel/env',
                  {
                    targets: [
                      'last 2 Chrome major versions',
                      'last 2 Firefox major versions'
                    ],
                    useBuiltIns: false,
                  },
                ],
              ],
            }
          }
        ]
      },
      plugins:  activePlugins
    },
  );
};
