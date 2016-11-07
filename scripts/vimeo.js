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
      maxwidth: 300,
      maxheight: 200
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
          .html(data.html);
        return data;
      });
  }

  function createVideoPlaceholder(video) {
    return $('<span class="video-placeholder"/>')
      .attr('data-video-id', video.id)
      .attr({'data-video-id': video.id, 'data-video-url': video.url})
      .append($('<img/>').attr('src', video.thumbnail_medium));
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
