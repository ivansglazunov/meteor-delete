Package.describe({
  name: 'ivansglazunov:delete',
  version: '0.2.2',
  summary: 'Delete status of the document and the history.',
  git: 'https://github.com/ivansglazunov/meteor-delete.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');

  api.use('ecmascript');
  api.use('mongo');
  api.use('templating');
  api.use('accounts-base');
  
	api.use('matb33:collection-hooks@0.8.1');
	api.use('dispatch:run-as-user@1.1.1');
	api.use('ivansglazunov:restrict@0.0.2');
  api.use('ivansglazunov:history@0.0.2');
  api.use('aldeed:simple-schema@1.5.3');
  api.use('ivansglazunov:refs@0.1.0');
  api.use('aldeed:collection2@2.8.0');
  api.use('stevezhu:lodash@4.3.0');
  
  api.addFiles('delete.html');
  api.addFiles('delete.js');
});