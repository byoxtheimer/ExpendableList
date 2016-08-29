window.EXL = window.EXL || {};

(function($) {

  EXL.App = (function() {

    function start() {
      document.addEventListener("deviceready", onDeviceReady, false);
    }

    function onDeviceReady() {
      loadDependencies();
      addAppHtml();
      setupRouter();
      //initializeAnalytics();
      waitForRenderThread(routeToHome);
    }

    function loadDependencies() {
      EXL.Dependencies.load();
    }

    function initializeAnalytics() {
      //EXL.Analytics.start();
    }

    function addAppHtml() {
      //$('body').append(`<navbar-element js-hook='navbar-element' class='is-gradient is-hidden'/>`);
      $('body').append(`<main js-hook='main-element' />`);
    }

    function setupRouter() {
      /* ACHTUNG! Did you add a **TEST** for the route you just added? */

      EXL.Router.setNavBar(jsHook('navbar-element')[0]);

      EXL.Router.addRoute('splash', '', '<splash-screen />');
      EXL.Router.addRoute('session-expired', 'Home', '<session-expired/>');
      EXL.Router.addRoute('home', 'Home', '<home-element js-hook="home-element" />');
      EXL.Router.addRoute('two', 'Two', '<two-element js-hook="two-element" />');
      EXL.Router.addRoute('no-account-menu', '', '<no-account-menu> </no-account-menu>');


    }

    function routeToHome() {
      EXL.Router.start('splash');
    }

    function waitForRenderThread(fn) {
      delay(fn);
    }

    return {
      start
    };

  })();

})(jQuery);
