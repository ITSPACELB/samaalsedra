import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import autoprefixer from 'autoprefixer'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // تحميل متغيرات البيئة
  const env = loadEnv(mode, process.cwd(), '')
  const isProduction = mode === 'production'
  const isDevelopment = mode === 'development'

  return {
    // المسار الأساسي - يحل مشاكل النشر (الحل الحقيقي لمشكلة اختلاف الشكل بين Vercel والمحلي)
    base: './',

    // الإضافات (Plugins)
    plugins: [
      // Vue مع الإعدادات المحسنة
      vue({
        script: {
          defineModel: true,
          propsDestructure: true
        },
        template: {
          compilerOptions: {
            // تحسين الأداء في الإنتاج
            hoistStatic: isProduction,
            cacheHandlers: isProduction
          }
        }
      }),

      // أدوات التطوير فقط في بيئة التطوير
      ...(isDevelopment ? [
        vueDevTools({
          launchEditor: 'vscode'
        })
      ] : []),

      // محلل Bundle فقط عند الطلب (للتحليل: ANALYZE=true npm run build)
      ...(env.ANALYZE === 'true' ? [
        visualizer({
          filename: 'dist/bundle-analysis.html',
          open: true,
          gzipSize: true,
          brotliSize: true
        })
      ] : [])
    ],

    // إعداد المسارات المختصرة
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
        '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
        '@stores': fileURLToPath(new URL('./src/stores', import.meta.url)),
        '@views': fileURLToPath(new URL('./src/views', import.meta.url)),
        '@composables': fileURLToPath(new URL('./src/composables', import.meta.url))
      },
      // امتدادات الملفات
      extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue']
    },

    // إعدادات CSS المحسنة
    css: {
      postcss: {
        plugins: [
          autoprefixer({
            overrideBrowserslist: [
              '> 1%',
              'last 2 versions',
              'not dead',
              'not ie <= 11',
              'iOS >= 12',
              'Android >= 8'
            ],
            grid: 'autoplace'
          })
        ]
      },
      devSourcemap: isDevelopment
    },

    // إعدادات خادم التطوير
    server: {
      port: parseInt(env.VITE_PORT) || 3000,
      host: true, // للوصول من الشبكة المحلية
      cors: true,
      open: env.VITE_OPEN === 'true',
      hmr: {
        overlay: true,
        port: 24678
      }
    },

    // إعدادات المعاينة
    preview: {
      port: parseInt(env.VITE_PREVIEW_PORT) || 4173,
      host: true,
      cors: true,
      open: env.VITE_OPEN === 'true'
    },

    // إعدادات البناء المحسنة
    build: {
      target: 'es2020', // توافق ممتاز مع 95%+ من المتصفحات
      cssTarget: 'chrome88', // دعم واسع
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true, // تنظيف تلقائي قبل كل build
      
      // تحسينات الأداء
      minify: isProduction ? 'terser' : false,
      terserOptions: isProduction ? {
        compress: {
          drop_console: true, // إزالة console.log في الإنتاج
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
          passes: 2
        },
        mangle: {
          safari10: true
        },
        format: {
          safari10: true,
          comments: false
        }
      } : {},

      // إعدادات Rollup المتقدمة
      rollupOptions: {
        output: {
          // تقسيم ذكي للكود
          manualChunks: (id) => {
            // مكتبات Vue الأساسية
            if (id.includes('vue') && id.includes('node_modules')) {
              if (id.includes('vue-router')) return 'vue-router'
              if (id.includes('pinia') || id.includes('vuex')) return 'state-management'
              return 'vue-vendor'
            }
            
            // مكتبات UI والأيقونات
            if (id.includes('phosphor') || id.includes('icons') || id.includes('heroicons')) {
              return 'icons'
            }
            
            // مكتبات التدويل
            if (id.includes('i18n') || id.includes('locale') || id.includes('intl')) {
              return 'i18n'
            }
            
            // مكتبات المخططات والرسوم البيانية
            if (id.includes('chart') || id.includes('d3') || id.includes('echarts')) {
              return 'charts'
            }
            
            // مكتبات التاريخ والوقت
            if (id.includes('dayjs') || id.includes('moment') || id.includes('date-fns')) {
              return 'date-utils'
            }
            
            // مكتبات الشبكة والAPI
            if (id.includes('axios') || id.includes('fetch') || id.includes('ky')) {
              return 'http-client'
            }
            
            // باقي المكتبات الخارجية
            if (id.includes('node_modules')) {
              if (id.includes('lodash') || id.includes('ramda')) return 'utils-vendor'
              return 'vendor'
            }
            
            // ملفات المشروع
            if (id.includes('/components/')) {
              return 'components'
            }
            
            if (id.includes('/composables/') || id.includes('/hooks/')) {
              return 'composables'
            }
            
            if (id.includes('/utils/') || id.includes('/helpers/') || id.includes('/lib/')) {
              return 'utils'
            }
            
            if (id.includes('/stores/') || id.includes('/store/')) {
              return 'stores'
            }
          },
          
          // أسماء ملفات محسنة مع hash للتخزين المؤقت
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.')
            const ext = info[info.length - 1]
            
            // تصنيف الملفات حسب النوع
            if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif/i.test(ext)) {
              return `images/[name]-[hash][extname]`
            }
            if (/woff2?|eot|ttf|otf/i.test(ext)) {
              return `fonts/[name]-[hash][extname]`
            }
            if (/css/i.test(ext)) {
              return `css/[name]-[hash][extname]`
            }
            return `assets/[name]-[hash][extname]`
          }
        },
        
        // إعدادات متقدمة
        treeshake: {
          preset: 'recommended',
          manualPureFunctions: ['defineComponent']
        }
      },

      // حدود التحذير من الأحجام
      chunkSizeWarningLimit: 1000,
      
      // تقرير الأحجام فقط في التطوير
      reportCompressedSize: isDevelopment,
      
      // Source maps للتطوير
      sourcemap: isDevelopment ? true : false
    },

    // تحسينات التبعيات
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        '@phosphor-icons/vue'
      ],
      exclude: [
        'vue-demi'
      ],
      esbuildOptions: {
        target: 'es2020'
      }
    },

    // متغيرات البيئة للتحسين
    define: {
      __VUE_OPTIONS_API__: JSON.stringify(env.VUE_OPTIONS_API !== 'false'),
      __VUE_PROD_DEVTOOLS__: JSON.stringify(env.VUE_PROD_DEVTOOLS === 'true'),
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(isDevelopment)
    },

    // إعدادات الأمان
    envPrefix: ['VITE_', 'VUE_APP_'],

    // إعدادات إضافية للأداء
    esbuild: {
      drop: isProduction ? ['console', 'debugger'] : [],
      legalComments: 'none'
    }
  }
})