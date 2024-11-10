import { resolve } from 'path';
import { build, LibraryOptions, resolveConfig, ResolvedConfig } from 'vite';

import { PackageJSON } from '@npm/types';
import { access, cp, readFile, writeFile } from 'fs/promises';

const encoding: 'utf-8' = 'utf-8';
const packageJsonKeysToKeep: Set<string | number> = new Set<keyof PackageJSON>([
  'author',
  'bugs',
  'bundleDependencies',
  'bundledDependencies',
  'contributors',
  'dependencies',
  'description',
  'files',
  'funding',
  'homepage',
  'keywords',
  'license',
  'main',
  'man',
  'name',
  'optionalDependencies',
  'peerDependencies',
  'peerDependenciesMeta',
  'repository',
  'types',
  'version'
]);

(async () => {
  const configFile: string = resolve(__dirname, 'vite.config.ts');
  await access(configFile);

  await build({
    configFile
  });

  const {
    build: { outDir, lib }
  }: ResolvedConfig = await resolveConfig(
    {
      configFile
    },
    'build'
  );
  if (typeof lib === 'boolean') {
    throw new Error('Vite config / build / lib is expected to be LibraryOptions');
  }
  const { fileName }: LibraryOptions = lib;

  const licenseFileName: string = 'LICENSE.md';
  const licenseFile: string = resolve(__dirname, licenseFileName);
  await access(licenseFile);
  await cp(licenseFile, resolve(__dirname, outDir, licenseFileName));

  const readMeFileName: string = 'README.md';
  const readMeFile: string = resolve(__dirname, readMeFileName);
  await access(readMeFile);
  await cp(readMeFile, resolve(__dirname, outDir, readMeFileName));

  const packageJsonFile: string = resolve(__dirname, 'package.json');
  const packageJson: PackageJSON = JSON.parse(
    await readFile(packageJsonFile, {
      encoding
    })
  );
  const modifiedPackageJson: Record<string, unknown> = Object.fromEntries(
    Object.entries(packageJson).filter(([key]) => packageJsonKeysToKeep.has(key))
  );
  await writeFile(
    resolve(__dirname, outDir, 'package.json'),
    JSON.stringify({
      ...modifiedPackageJson,
      main: `${fileName}.mjs`,
      browser: `${fileName}.mjs`,
      types: `${fileName}.d.ts`,
      license: 'MIT'
    } satisfies Partial<PackageJSON>),
    {
      encoding
    }
  );
})();
