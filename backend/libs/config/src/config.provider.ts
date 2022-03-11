import { Provider } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { Config } from './config';
import * as yaml from 'yaml';

const CONFIG = Symbol('CONFIG');

async function loadConfig(path: string): Promise<Config> {
  const source = await readFile(path);
  return yaml.parse(source.toString());
}

function ConfigProvider(path: string): Provider<Promise<Config>> {
  return {
    provide: CONFIG,
    useFactory: () => loadConfig(path)
  };
}

export { ConfigProvider, CONFIG };
