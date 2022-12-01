export default {
  input: 'build/main.js',
  output: {
    file: './dist/bundle.js',
    format: 'iife',
    globals: {
      'pixi.js': 'PIXI',
      'pixi-layers': 'pixi_display',
    }
  },
  external: [
    'pixi.js'
  ]
};
