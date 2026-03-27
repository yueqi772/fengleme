import { defineConfig } from '@tarojs/cli';

export default defineConfig({
  appPath: process.cwd(),
  projectName: 'zhichang-qingxing',
  date: new Date().toISOString(),
  designWidth: 750,
  deviceRatio: {
    '375': 2,
    '414': 2,
    '640': 750 / 640,
    '750': 1,
    '828': 750 / 828,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  framework: 'react',
  mini: {
    compile: {
      exclude: [],
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
      url: {
        enable: true,
        config: {
          limit: 1024,
        },
      },
    },
  },
});
