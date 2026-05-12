import extensionPkg from '../../../extension/package.json' with { type: 'json' }

export const extensionVersion = extensionPkg.version

export const extensionVersionShort = extensionPkg.version
  .split('.')
  .slice(0, 2)
  .join('.')
