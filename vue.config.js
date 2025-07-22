// vue.config.js

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/sama-18pfprnjw-1984-project-28463c2c.vercel.app/'
    : '/',
  filenameHashing: true,
  assetsDir: 'assets',
  css: {
    extract: true,
    sourceMap: false,
    loaderOptions: {
      css: {
        modules: false
      },
      sass: {
        // هذا السطر هو المطلوب إضافته لدعم SCSS تلقائيًا
        prependData: `@import "@/assets/styles/_mixins.scss";`
      }
    }
  },
  chainWebpack: (config) => {
    // إضافة hash للأسماء لتجنّب مشاكل الكاش
    config.output.filename('[name].[contenthash].js').end();
    config.output.chunkFilename('[name].[contenthash].js').end();

    // دعم custom elements
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

    // دعم تحميل الخطوط
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
