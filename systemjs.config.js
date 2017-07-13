/**
* System configuration for Angular samples
* Adjust as necessary for your application needs.
*/
(function (global) {
  System.config({
    paths: {
      // paths serve as alias
      'npm:': 'node_modules/'
    },
    // map tells the System loader where to look for things
    map: {
      // our app is within the app folder
      app: 'app',

      // angular bundles
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',

      'ng2-adal': 'npm:ng2-adal',
      'adal': 'npm:adal-angular/lib',
      'adal-angular': 'npm:adal-angular/lib',

      'underscore': 'npm:underscore/underscore.js',
      'jquery': 'npm:jquery/dist/jquery.js',
      // other libraries
      'rxjs': 'npm:rxjs',
      'angular-in-memory-web-api': 'npm:angular-in-memory-web-api/bundles/in-memory-web-api.umd.js',
      'angular2-fontawesome': 'npm:angular2-fontawesome',
      'angular2-materialize': 'npm:angular2-materialize',
      'moment': 'npm:moment/moment.js',
      'primeng' : 'npm:primeng',
      'ngx-tooltip': 'node_modules/ngx-tooltip'


    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
       app: { main: 'main.js', defaultExtension: 'js'},
      'ng2-adal': { main: 'core.js', defaultExtension: 'js' },
      'adal-angular': {main: 'adal-angular', defaultExtension: 'js'},
      'adal': { main: 'adal.js', defaultExtension: 'js' },
      'rxjs': { main: 'Rx.js', defaultExtension: 'js'},
      'angular2-fontawesome': { defaultExtension: 'js' },
      'moment': { main: 'adal.js', defaultExtension: 'js' },
      'ngx-tooltip': { main: 'index.js', defaultExtension: 'js' },
       primeng: {
          defaultExtension: 'js'
      }
      

    }



  });
})(this);
