import { existsSync } from 'fs';
import { resolve } from 'path';

/* 
Get the path of the environment file based on the NODE_ENV variable or the development environment file 
if the NODE_ENV variable is not set. 
 If the environment file does not exist, the default environment file is returned.
*/
export function getEnvPath(dest: string): string {
  const env: string | undefined = process.env.NODE_ENV;
  const fallback: string = resolve(`${dest}/.env`);
  const filename: string = env ? `${env}.env` : 'development.env';
  let filePath: string = resolve(`${dest}/${filename}`);

  if (!existsSync(filePath)) {
    filePath = fallback;
  }

  return filePath;
}