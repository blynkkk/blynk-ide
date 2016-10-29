'use babel';

import path from 'path';
import child_process from 'child_process';

export const DEFAULT_PIO_ARGS = ['-f', '-c', 'atom'];

/**
 * Annotates a view with a path to a template.
 *
 * Usage:
 *     @withTemplate(__dirname)
 *     class SomeView extends BaseView {}
 */
export function withTemplate(templateDirectory, templateFilename='template.html') {
  return function(target) {
    target.prototype.__template = path.resolve(templateDirectory, templateFilename);
  };
}

export function spawnPlatformIOCommand(args, options={}) {
  return new Promise((resolve, reject) => {
    let stdout = '', stderr = '';
    const child = child_process.spawn('pio', DEFAULT_PIO_ARGS.concat(args), options);
    child.stdout.on('data', chunk => stdout += chunk);
    child.stderr.on('data', chunk => stderr += chunk);
    child.on('error', (err) => reject(err));
    child.on('close', (code) => {
      if (0 !== code) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}