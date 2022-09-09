import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: [
    'src/index'
  ],
  externals: [
    'node:path',
    'fs-extra'
  ]
});
