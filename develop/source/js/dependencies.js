window.EXL = window.EXL || {};

EXL.Dependencies = {
  load: function() {

  },
  cleanup: function() {

  }
};

/*========== GLOBAL HELPER FUNCTIONS =========== */

function jsHook(hook, context) {
  let query = `[js-hook~='${hook}']`;
  if (context) {
    return $(context).find(query);
  }
  return $(query);
}

function delay(fn, time) {
  setTimeout(fn, time);
}
