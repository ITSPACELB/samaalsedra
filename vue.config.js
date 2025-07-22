// vue.config.js

module.exports = {
  filenameHashing: true,
  css: {
    extract: true,
    sourceMap: false,
    loaderOptions: {
      css: {
        modules: false
      },
      sass: {
        additionalData: `@import "@/assets/styles/_mixins.scss";`
      }
    }
  },
  chainWebpack: (config) => {
    config.output.filename('[name].[contenthash].js').end();
    config.output.chunkFilename('[name].[contenthash].js').end();

    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        return {
          ...options,
          compilerOptions: {
            isCustomElement: (tag) => tag.startsWith('xai-')
          }
        };
      });

    config.module
      .rule('fonts')
      .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .tap(() => ({
        limit: 10000,
        name: 'fonts/[name].[hash:7].[ext]'
      }));
  }
};
