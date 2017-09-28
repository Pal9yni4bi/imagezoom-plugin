/**
 * imageZoom Plugin
 * https://github.com/Pal9yni4bi/imagezoom-plugin
 * MIT licensed
 *
 * Copyright (C) 2017 https://github.com/Pal9yni4bi/imagezoom-plugin A project by Andrei Kaltsou
 */
(function($){
  var defaults = {
    cursorColor: '255,255,255',
    opacity: 0.5,
    cursor: 'crosshair',
    zIndex: 2147483647,
    zoomViewSize: [430, 330],
    zoomViewPosition: 'right',
    zoomViewMargin: -16,
    zoomViewBorder: 'none',
    boxShadow: 'none',
    magnification: 3
  };

  var imageZoomCursor,
    imageZoomView,
    settings,
    imageWidth,
    imageHeight,
    offset,
    cursorSize,
    methods = {
      init: function (options) {

        var $this = $(this);

        imageZoomCursor = $('.imageZoom-cursor');
        imageZoomView = $('.imageZoom-view');

        $(document).on('mouseenter', $this.selector, function(e) {

          var data = $(this).data(),
            imageSrc;

          settings = $.extend({}, defaults, options, data);
          offset = $(this).offset();
          imageWidth = $(this).width();
          imageHeight = $(this).height();

            cursorSize = [
              (settings.zoomViewSize[0] / settings.magnification),
              (settings.zoomViewSize[1] / settings.magnification)
            ];

          if (data.imageZoom == true) {
            imageSrc = $(this).attr('src');
          } else {
            imageSrc = $(this).get(0).getAttribute('data-imageZoom');
          }

          var posX = e.pageX,
            posY = e.pageY,
            zoomViewPositionX;
          $('body').prepend('<div class="imageZoom-cursor">&nbsp;</div><div class="imageZoom-view"><img src="' + imageSrc + '"></div>');

          if (settings.zoomViewPosition == 'right') {
            zoomViewPositionX = (offset.left + imageWidth + settings.zoomViewMargin);
          } else {
            zoomViewPositionX = (offset.left - imageWidth - settings.zoomViewMargin);
          }

          $(imageZoomView.selector).css({
            'position': 'absolute',
            'left': zoomViewPositionX,
            'top': offset.top - 38,
            'width': cursorSize[0] * settings.magnification,
            'height': cursorSize[1] * settings.magnification,
            'background': '#000',
            'z-index': 2147483647,
            'overflow':'hidden',
            'border': settings.zoomViewBorder,
            'box-shadow': settings.boxShadow
          });

          $(imageZoomView.selector).children('img').css({
            'position': 'absolute',
            'width': imageWidth*settings.magnification,
            'height': imageHeight*settings.magnification,
          });

          $(imageZoomCursor.selector).css({
            'position': 'absolute',
            'width': cursorSize[0],
            'height': cursorSize[1],
            'background-color': 'rgb(' + settings.cursorColor + ')',
            'z-index': settings.zIndex,
            'opacity': settings.opacity,
            'cursor': settings.cursor
          });
          $(imageZoomCursor.selector).css({
            'top': posY - (cursorSize[1] / 2),
            'left': posX
          });
          $(document).on('mousemove', document.body, methods.cursorPos);
        });
      },
      cursorPos:function(e){
        var posX = e.pageX,
          posY = e.pageY;
        if (posY < offset.top || posX < offset.left || posY > (offset.top + imageHeight) || posX > (offset.left + imageWidth)){
          $(imageZoomCursor.selector).remove();
          $(imageZoomView.selector).remove();
          return;
        }

        if (posX - (cursorSize[0] / 2) < offset.left) {
          posX = offset.left+(cursorSize[0] / 2);
        } else if(posX + (cursorSize[0] / 2) > offset.left+imageWidth){
          posX = (offset.left+imageWidth)-(cursorSize[0] / 2);
        }

        if (posY-(cursorSize[1] / 2) < offset.top) {
          posY = offset.top + (cursorSize[1] / 2);
        } else if(posY+(cursorSize[1] / 2) > offset.top + imageHeight) {
          posY = (offset.top + imageHeight) - (cursorSize[1]/2);
        }

        $(imageZoomCursor.selector).css({
          'top': posY - (cursorSize[1] / 2),
          'left': posX - (cursorSize[0] / 2)
        });
        $(imageZoomView.selector).children('img').css({
          'top': ((offset.top - posY) + (cursorSize[1] / 2)) * settings.magnification,
          'left': ((offset.left - posX) + (cursorSize[0] / 2)) * settings.magnification
        });

        $(imageZoomCursor.selector).mouseleave(function(){
          $(this).remove();
        });
      }
    };

  $.fn.imageZoom = function(method){
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error(method);
    }
  }

  $(document).ready(function(){
    $('[data-imageZoom]').imageZoom();
  });
})(jQuery);
