import { Config } from '@stencil/core';
const { sass } = require('@stencil/sass');
import { angularOutputTarget, ValueAccessorConfig } from '@stencil/angular-output-target';

const angularValueAccessorBindings: ValueAccessorConfig[] = [];

export const config: Config = {
  namespace: 'karyaflow-designer',
  outputTargets: [
    {
      type: 'dist',
    },
    {
      type: 'docs-readme'
    },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    },
    angularOutputTarget({
      componentCorePackage: '@karyaflow-designer/dist/types',
      directivesProxyFile: '../angular-project/src/lib/stencil-generated/proxies.ts',
      valueAccessorConfigs: angularValueAccessorBindings
    })

  ],
  plugins: [
    sass()
  ]
};
