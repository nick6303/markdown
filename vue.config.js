const isProduction = process.env.NODE_ENV === 'production'
const Version = new Date().getTime()

module.exports = {
  // publicPath: isProduction ? '/2020nick/' : '/',
  publicPath: '/',
  devServer: {
    port: 8080,
    proxy: {
      '/esapi/': {
        target: 'https://10.11.233.101:9200/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/esapi': '',
        },
      },
      '/esmanageapi/': {
        target: 'http://10.11.233.213:8000/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/esmanageapi/': '',
        },
      },
      '/esdynamic/': {
        target: 'http://10.40.192.210:8080/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/esdynamic/': '',
        },
      },
      '/scanapi/': {
        target: 'http://10.40.192.212:8000/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/scanapi/': '',
        },
      },
      '/nmap/': {
        target: 'http://10.40.192.210:9001/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/nmap/': '',
        },
      },
      '/prometheusApi/': {
        target: 'http://10.11.233.103:9090/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/prometheusApi/': '',
        },
      },
      '/yml/': {
        target: 'http://10.40.192.210:9091/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/yml/': '',
        },
      },
      '/alertmanager/': {
        target: 'http://10.11.233.103:9093/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/alertmanager/': '',
        },
      },
      '/filter/': {
        target: 'http://10.40.192.210:8100/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/filter/': '',
        },
      },
      '/fileapi/': {
        target: 'http://10.40.192.210:8200/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/fileapi/': '',
        },
      },
      '/mdapi/': {
        target: 'http://10.40.192.210:9091/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/mdapi/': '',
        },
      },
      '/projmanapi/': {
        target: 'http://10.11.233.213:8000/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/projmanapi/': '',
        },
      },
    },
  },
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = 'MarkDown'
      return args
    })
    if (isProduction) {
      // 给js和css配置版本号
      config.output.filename('js/[name].[chunkhash].' + Version + '.js').end()
      config.output
        .chunkFilename('js/[name].[chunkhash].' + Version + '.js')
        .end()
    }
    // pug
    const pugRule = config.module.rule('pug')
    pugRule
      .test(/\.pug$/)
      .use('pug-html-loader')
      .loader('pug-html-loader')
      .end()
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@as': '@/assets',
        '@c': '@/components',
        '@v': '@/views',
        '@img': '@/assets/img',
        '@fonts': '@/assets/fonts',
        '@css': '@/assets/css',
        '@api': '@/api',
        '@router': '@/router',
        '@mock': '@/mock',
      },
    },
    optimization: isProduction
      ? {
          runtimeChunk: 'single',
          splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 20000,
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name(module) {
                  const packageName = module.context.match(
                    /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                  )[1]
                  return `npm.${packageName.replace('@', '')}`
                },
              },
            },
          },
        }
      : {},
  },
  css: {
    extract: false,
    loaderOptions: {
      sass: {
        additionalData: '@import "@css/base/_variable.sass"',
      },
    },
  },
  productionSourceMap: false,
}
