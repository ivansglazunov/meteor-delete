Package.describe({
  name: 'ivansglazunov:delete',
  version: '0.0.0',
  summary: 'Marking a document as a deleted someone.',
  git: 'https://github.com/ivansglazunov/meteor-delete.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');

  api.use('ecmascript');
  api.use('mongo');
  api.use('accounts-base');
  
  api.use('aldeed:simple-schema@1.5.3');
  api.use('ivansglazunov:refs@0.1.0');
  api.use('stevezhu:lodash@4.3.0');
  
  api.addFiles('delete.js');
});