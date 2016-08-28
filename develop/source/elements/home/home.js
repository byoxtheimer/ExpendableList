(function($) {

  class HomeElement extends EXL.Elements.BaseElement {

    bindTemplate() {
      $(this).html(`
        <button js-hook="link-two">
          <p>Goto Two</p>
        </button>
      `);
    }

    bindEvents() {
      jsHook("link-two", this).click(() => this.onTwoClick());
    }

    onTwoClick() {
      EXL.Router.go("two");
    }

  }
  EXL.Elements.register('home-element', HomeElement);

})(jQuery);
