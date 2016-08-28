(function($) {

  class TwoElement extends EXL.Elements.BaseElement {

    bindTemplate() {
      $(this).html(`
        <h1>PAGE TWO!</h1>
      `);
    }

  }
  EXL.Elements.register('two-element', TwoElement);

})(jQuery);
