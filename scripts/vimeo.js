window.tekt = window.tekt || {};

tekt.vimeo = (function ($) {

  function init() {
    $(document.body).on('click', '.video-placeholder', function (event) {
      event.preventDefault();
      replaceVideoPlaceholder(this);
    });
  }

  function getAlbumVideos(albumId) {
    return $.ajax('https://vimeo.com/api/v2/album/' + albumId + '/videos.json', {dataType: 'jsonp'});
  }

  var oembedUrl = 'https://vimeo.com/api/oembed.json';

  function getVideoEmbed(videoUrl, params) {
    params = $.extend({
      url: videoUrl,
      byline: false,
      title: true,
      portrait: false,
      loop: false,
      autopause: true,
      autoplay: false,
      player_id: '',
      maxwidth: 400,
      maxheight: 300
    }, params);
    return $.ajax(oembedUrl, {
      dataType: 'jsonp',
      data: params
    });
  }

  function replaceVideoPlaceholder(placeholder) {
    placeholder = $(placeholder);
    var url = placeholder.attr('data-video-url');
    if (!url) {
      return;
    }
    return getVideoEmbed(url)
      .then(function (data) {
        placeholder
          .removeClass('video-placeholder')
          .addClass('vimeo-video')
          .html(data.html);
        return data;
      });
  }

  function createVideoPlaceholder(video) {
    var placeholder = tekt.shared.cloneTemplate('#video-placeholder-template');
    placeholder.attr('data-video-url', video.url);
    placeholder.find('img').attr('src', video.thumbnail_large);
    placeholder.find('figcaption').text(video.title);
    return placeholder;
  }

  function addAlbumPlaceholders(albumId, container) {
    return getAlbumVideos(albumId)
      .then(function (videos) {
        videos.forEach(function (video) {
          createVideoPlaceholder(video)
            .appendTo(container);
        });
        return videos;
      });
  }

  init();

  return {
    addAlbum: addAlbumPlaceholders
  };
})(jQuery);
