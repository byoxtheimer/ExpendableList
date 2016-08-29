var EXL = EXL || {};
EXL.Elements = EXL.Elements || {};

(function() {

  class BaseElement extends HTMLElement {

    /*
      lifecycle callbacks - do not override these
     */

    createdCallback() {
      this.bindDependencies();
      this.bindTemplate();
    };

    attachedCallback() {
      Promise.resolve().then(() => {
        this.loadData().then(()=> {
          this.bindEvents();
          this.doLoadTransition();
        });
      });
    };

    attributeChangedCallback(attrName, oldVal, newVal) {
      this.doAttributeChanged(attrName, oldVal, newVal);
    };

    detachedCallback() {
      this.unbindEvents();
    };

    /*
      helpers for lifecycle callbacks - override these if needed
     */

    bindDependencies() {
      /*
        Used to bind external dependencies in EXL.Dependencies to the
        current object.

        Example:
        this.fizzbuzz = EXL.Dependencies.FizzBuzz;
        this.foobar = EXL.Dependencies.FooBar;

       */
    };

    bindTemplate() {
      /*
        Used to assign the HTML template to the element and to bind
        jQuery tags to the element for later use.

        Example:
        $(this).html(`
          <div>Killroy Was Here</div>
          <p>And so was Bob</p>
        `);

        this.$theDiv = $(this).find('div');
        this.$theParagraph = $(this).find('p');

       */
    };

    loadData() {
      return Promise.resolve();
      /*
        Used to load data into the template using the dependencies and
        jQuery tags. This method must return a promise.

        Example:
        return this.fizzbuzz.fizzTheBuzz(15).then(result => {
          this.$theDiv.text(result);
        });

       */
    };

    bindEvents() {
      /*
        Used to bind events such as click and change.

        Example:
        this.$okButton.on('click', () => this.okButtonPressed());
        this.$cancelButton.on('click', () => this.cancelButtonPressed());

       */
    };

    doLoadTransition() {
      /*
        Used to animate the rendering of this element, typically by adding
        classes to elements.

       */
    };

    doAttributeChanged(attrName, oldVal, newVal) {
      /*
        Used to catch when an attribute changes on the custom element.

        Example:
        if (attrName === 'foo') {
          this.doFooThing(newVal);
        } else if (attrName === 'bar') {
          this.doBarThing(newVal);
        }

       */

    };

    unbindEvents() {
      /*
        Used to unbind events from EXL.PubSub so that memory leaks aren't
        created.

        Example:
        EXL.PubSub.unsub('routechanged', 'facilities-list');

       */
    };

  };

  EXL.Elements.BaseElement = BaseElement;

  let elements = {};
  let methods = [
    'bindDependencies',
    'bindTemplate',
    'loadData',
    'bindEvents',
    'doLoadTransition',
    'doAttributeChanged',
    'unbindEvents'
  ];

  EXL.Elements.register = function(tag, base) {
    let element = document.registerElement(tag, base);
    elements[tag] = base;
    EXL.Elements[base.name] = element;
    EXL.Elements[`${base.name}Base`] = base;
  };

  EXL.Elements.mock = function(tag) {

    let mocked = elements[tag].prototype;

    methods.forEach(method => {
      mocked[`_${method}`] = mocked[method];
      mocked[method] = function() {};
    });

    mocked.loadData = function() {
      return Promise.resolve({});
    }

    return mocked;
  };

  EXL.Elements.unmock = function(tag) {

    let mocked = elements[tag].prototype;

    methods.forEach(method => {
      mocked[method] = mocked[`_${method}`];
      delete mocked[`_${method}`];
    });
  };

})();
