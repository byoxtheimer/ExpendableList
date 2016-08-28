(function($) {

  const ANIMATION_DELAY = 1650;

  class SplashScreenElement extends EXL.Elements.BaseElement {

    bindTemplate() {
      $(this).html(`<div js-hook="logo" class="logo"><img src="assets/logo.svg" /></div>`);
    }

    bindEvents() {
      setTimeout(() => this.onAnimationComplete(), ANIMATION_DELAY);
    }

    onAnimationComplete() {
      EXL.Router.start('home');
    }

  }
  EXL.Elements.register("splash-screen", SplashScreenElement);

})(jQuery);
