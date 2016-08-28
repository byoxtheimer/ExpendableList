window.EXL = window.EXL || {};

EXL.PubSub = (function() {

  let callbacks = {};

  function pub(name, data) {
    document.dispatchEvent(new CustomEvent(name, { detail: data }));
  }

  function sub(name, subscriber, callback) {
    callbacks[name] = callbacks[name] || {};
    callbacks[name][subscriber] = callback;
    document.addEventListener(name, callback, false);
  }

  function unsub(name, subscriber) {
    if (callbacks[name]) {
      document.removeEventListener(name, callbacks[name][subscriber]);
      delete callbacks[name][subscriber];
    }
  }

  return { pub, sub, unsub };

})();
