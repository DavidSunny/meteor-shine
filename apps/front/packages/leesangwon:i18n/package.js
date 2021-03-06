Package.describe({
  name: 'leesangwon:i18n',
  version: '0.9.0',
  summary: 'Internationalization package',
  // URL to the Git repository containing the source code for this package.
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.1');

  api.use([
    'templating',
    'underscore',
    'tracker'
  ], ['client', 'server']);

  api.export('I18n');

  api.addFiles('i18n.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('leesangwon:i18n');
  api.addFiles('i18n-tests.js');
});
