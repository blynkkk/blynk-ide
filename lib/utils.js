'use babel';

import path from 'path';

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
