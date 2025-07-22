module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/sama-18pfprnjw-1984-project-28463c2c.vercel.app/' : '/',
  assetsDir: 'assets',
  css: {
    extract: true,
    sourceMap: false,
    loaderOptions: {
      sass: {
        additionalData: `@import "@/assets/styles/variables";`, // تأكد من استيراد الـ variables أولاً
        sassOptions: {
          includePaths: ['src/assets/styles'], // مسار SCSS
        },
      },
      css: {
        modules: false,
      },
    },
  },
  chainWebpack: (config) => {
    config.output.filename('[name].[contenthash].js').end();
    config.output.chunkFilename('[name].[contenthash].js').end();

    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => ({
        ...options,
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('xai-'),
        },
      }));

    config.module
      .rule('fonts')
      .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/)
      .use('file-loader')
      .loader('file-loader')
      .tap(() => ({
        name: 'fonts/[name].[hash:7].[ext]',
      }));

    // معالجة SCSS بشكل صحيح
    config.module
      .rule('scss')
      .test(/\.scss$/)
      .use('sass-loader')
      .loader('sass-loader')
      .tap(options => ({
        ...options,
        sourceMap: false,
      }));
  },
};