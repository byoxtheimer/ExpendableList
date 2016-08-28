window.EXL = window.EXL || {};

(function($) {

  EXL.RouterStack = function() {

    let stack = [];

    function push(route, data) {
      stack.push( data ? { route, data } : { route });
    }

    function pop() {
      return stack.pop();
    }

    function peek() {
      return _.last(stack);
    }

    function route() {
      return peek().route;
    }

    function data() {
      return peek().data;
    }

    function clear() {
      stack = [];
    }

    function size() {
      return stack.length;
    }

    this.push = push;
    this.pop = pop;
    this.peek = peek;
    this.route = route;
    this.data = data;
    this.clear = clear;
    this.size = size;

  };

  EXL.RouterTable = function() {

    let table = {};

    function add(route, title, html) {
      table[route] = {
        route: route,
        templated: html ? _.template(html) : null,
        title: title
      };
    }

    function title(route) {
      return table[route].title;
    }

    function hasTemplate(route) {
      return table[route].templated !== null;
    }

    function render(route, data) {
      return table[route].templated(data);
    }

    this.add = add;
    this.title = title;
    this.hasTemplate = hasTemplate
    this.render = render;

  };

  EXL.Router = (function() {

    let routingTable = new EXL.RouterTable();
    let routingStack = new EXL.RouterStack();
    let theNavbar;

    function setNavBar(navbar) {
      theNavbar = navbar;
    }

    function addRoute(route, title, html) {
      routingTable.add(route, title, html);
    }

    function start(route, data) {
      routingStack.clear();
      routingStack.push(route, data);
      renderRoute();
    }

    function go(route, data) {
      routingStack.push(route, data);
      renderRoute();
    }

    function back() {
      if (routingStack.size() > 1) {
        routingStack.pop();
        renderRoute();
      } else {
        if (navigator.app && navigator.app.exitApp) navigator.app.exitApp();
      }
    }

    function getTitle() {
      let route = routingStack.route();
      return routingTable.title(route);
    }

    function renderRoute() {
      publishRouteEvent();
      //showOrHideBackButton();
      //showNavBar();
      renderHtmlForRoute();
      updateRouteClass();
    }

    function publishRouteEvent() {
      EXL.PubSub.pub('routechanged', routingStack.peek());
    }

    function showOrHideBackButton() {
      if (routingStack.size() === 1) {
        theNavbar.hideBackButtonAndTitle();
      } else {
        let route = routingStack.route();
        theNavbar.showBackButtonAndTitle(routingTable.title(route));
      }
    }

    function showNavBar() {
      $(theNavbar).removeClass('is-hidden');
    }

    function renderHtmlForRoute() {
      let route = routingStack.route();
      let data = routingStack.data();
      if (routingTable.hasTemplate(route)) {
        $('main').html(routingTable.render(route, data));
      }
    }

    function updateRouteClass() {
      let route = routingStack.route();
      let classesThatStartWithRoute = function(className) {
        return /^route-/.test(className);
      };

      let findAllRouteClasses = function(index, allClasses) {
        let classes = allClasses.split(' ');
        return classes.filter(classesThatStartWithRoute).join(' ');
      };

      $('html').removeClass(findAllRouteClasses);
      $('html').addClass(`route-${route}`);
    }

    document.addEventListener("backbutton", back, false);

    return { setNavBar, addRoute, start, go, back, getTitle };

  })();

})(jQuery);
