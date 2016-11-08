window.tekt = window.tekt || {};

tekt.flickr = (function ($) {

  var API_KEY = 'fb078d9843bec343a2ff9b8c4cb65a36';
  var apiUrl = 'https://api.flickr.com/services/rest/',
    extras = 'date_upload,date_taken,last_update,tags,o_dims,path_alias,url_sq,url_t,url_s,url_m,url_o,owner_name';

  function getSetImages(setId) {
    return $.ajax(apiUrl,
      {
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        data: {
          method: 'flickr.photosets.getPhotos',
          api_key: API_KEY,
          format: 'json',
          // nojsoncallback: '1',
          photoset_id: setId,
          extras: extras
        }
      })
      .then(function (data) {
        if (!data.photoset) {
          return [];
        }
        return data.photoset.photo;
      });
  }

  function renderImages(images) {
    return images.map(function (image) {
      var figure = tekt.shared.cloneTemplate('#image-template');
      figure.find('.full-link').attr('href', image.url_o);
      figure.find('img').attr('src', image.url_m);
      figure.find('figcaption').text(image.title);
      return figure;
    });
  }

  function loadSetImages(setId, container) {
    getSetImages(setId)
      .then(function (images) {
        $(container).append(renderImages(images));
      })
  }

  return {
    getSetImages: getSetImages,
    loadSetImages: loadSetImages
  };
})(jQuery);
