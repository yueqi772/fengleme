import type { IConfig } from '@tarojs/taro';
const config: IConfig = {
  projectName: 'zhichang-qingxing',
  date: new Date().toISOString(),
  designWidth: 750,
  deviceRatio: {
    '375': 2 / 750,
    '414': 2 / 414,
    '375 * 2 / 414': 2 / (414 * 0.667),
    '750': 1,
    '640': 750 / 640,
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
};
export default config;
