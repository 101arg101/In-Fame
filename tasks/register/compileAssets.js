/**
 * `compileAssets`
 *
 * ---------------------------------------------------------------
 *
 * This Grunt tasklist is not designed to be used directly-- rather
 * it is a helper called by the `default`, `prod`, `build`, and
 * `buildProd` tasklists.
 *
 * For more information see:
 *   http://sailsjs.org/documentation/anatomy/my-app/tasks/register/compile-assets-js
 *
 */
module.exports = function(grunt) {
  grunt.registerTask('compileAssets', [
    'clean:dev',
    'jst:dev',
    'less:dev',
    'copy:dev',
    'copy:modules',
    'coffee:dev'
  ]);
  
  grunt.registerTask('run-grunt', function () {
    var done = this.async();
    grunt.util.spawn({
        grunt: true,
        args: [''],
        opts: {
            cwd: 'node_modules/bootstrap'
        }
    }, function (err, result, code) {
        done();
    });
});
};
