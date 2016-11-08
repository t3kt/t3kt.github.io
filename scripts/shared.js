window.tekt = window.tekt || {};

tekt.shared = (function($) {

  function cloneTemplate(selector) {
    var template = $(selector);
    return $(document.importNode(template[0].content, true)).children();
  }

  return {
    cloneTemplate: cloneTemplate
  }
})(jQuery);
