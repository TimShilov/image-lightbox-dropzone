"use strict";

/*!
 * Image Lightbox Dropzone jQuery Plugin.
 * Created by Tim Shilov - https://github.com/TimShilov/image-lightbox-dropzone
 * Version: 0.0.2
 */
(function imagePreviewWrapper($) {
  var defaults = {
    onDeleted: undefined,
    onUploaded: undefined,
    ajax: {
      method: 'POST',
      url: '',
      data: {}
    },
    dropzone: {
      url: '',
      acceptedFiles: '.jpg,.jpeg,.png',
      maxFilesize: 4,
      // MB
      previewTemplate: '<div style="display: none"></div>',
      uploadMultiple: false,
      dictDefaultMessage: ''
    }
  };
  var $shade;

  function attachLightbox(element, opts) {
    var $element = $(element);
    var options = $.extend(true, {}, defaults, opts);
    $element.data('options', options);

    if (element.tagName !== 'IMG') {
      $element.addClass('ild-no-image');
      $element.html('Add Image<i class="fa fa-pencil"></i>');
    }

    $element.off('click').on('click', function () {
      openShade($element, element.tagName !== 'IMG');
    });
  }

  var openShade = function openShade($element) {
    var forceDropzone = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    $('#ild-shade').remove();
    var URL = $element.attr('src');
    var options = $element.data('options');
    var shadeTemplate = "<div id=\"ild-shade\" class=\"shade\" style=\"display: none\">\n\t\t\t\t\t\t\t\t<button class=\"closeBtn\">+</button>\n\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t<div class=\"image-wrapper\" style=\"".concat(forceDropzone ? 'display: none' : '', "\">\n\t\t\t\t\t\t\t\t\t\t<img id=\"shadeImg\" src=\"").concat(URL, "\" alt=\"\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"buttons\">\n\t\t\t\t\t\t\t\t\t\t<a class=\"deleteBtn\">\n\t\t\t\t\t\t\t\t\t\t\t<i class=\"fa fa-trash\" aria-hidden=\"true\"></i>\n\t\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div id=\"ild-dropzone\" class=\"dropzone drop-area dropzone-file-area\" style=\"").concat(forceDropzone ? '' : 'display: none', "\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"dz-default dz-message\">\n\t\t\t\t\t\t\t\t\t\t\t<h3>Drop new image here or click to upload</h3>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>");
    $shade = $(shadeTemplate).appendTo('body');
    $shade.off('click').on('click', function (event) {
      if (event.target.className === 'shade') {
        closeShade();
      }
    });

    if (forceDropzone) {
      initDropzone(options);
    }

    $shade.find('.closeBtn').off('click').on('click', closeShade);
    $shade.find('.deleteBtn').off('click').on('click', function () {
      deleteImage(options);
    });
    $shade.fadeIn(150);
  };

  var closeShade = function closeShade() {
    $('#ild-shade').fadeOut(150, function () {
      $('#ild-shade').remove();
    });
  };

  var deleteImage = function deleteImage(options) {
    $.ajax({
      url: options.ajax.url,
      method: options.ajax.method,
      data: options.ajax.data
    }).done(function () {
      toastr.success('Image deleted successfully.');
      $shade.find('img').remove();
      $('.image-wrapper').hide();
      initDropzone(options);

      if (options.onDeleted) {
        options.onDeleted();
      }
    }).fail(function (response) {
      toastr.error(response.responseJSON.error || 'Image not updated.');
    });
  };

  var initDropzone = function initDropzone(options) {
    var dropzoneConfig = $.extend(true, {}, options.dropzone, {
      init: function init() {
        var _this = this;

        this.on('success', function (file, response) {
          if (response.status !== 'success') {
            toastr.error(response.responseJSON.error || 'Image not updated.');
            return false;
          }

          toastr.success('Image added successfully.');
          closeShade();

          if (options.onUploaded) {
            options.onUploaded();
          }

          _this.removeFile(file);
        });
        this.on('error', function (file, err) {
          _this.removeFile(file);

          toastr.error(err.error || err || 'Error');
        });
      }
    });
    $shade.find('.dropzone').dropzone(dropzoneConfig).show();
  };

  $.fn.imageLightbox = function imageLightbox(options) {
    // Verify an empty collection wasn't passed.
    if (!this.length) {
      return this;
    } // Loop through each plugin object and attach Lightbox.


    return this.each(function attachImageLightbox() {
      attachLightbox(this, options);
    });
  };
})(jQuery);