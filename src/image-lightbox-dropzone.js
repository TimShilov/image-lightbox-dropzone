/*!
 * Image Lightbox Dropzone jQuery Plugin.
 * Created by Tim Shilov - https://github.com/TimShilov/image-lightbox-dropzone
 * Version: %APP_VERSION%
 */

(function imagePreviewWrapper($) {
    const defaults = {
        onDeleted: undefined,
        onUploaded: undefined,
        ajax: {
            method: 'POST',
            url: '',
            data: {},
        },
        dropzone: {
            url: '',
            acceptedFiles: '.jpg,.jpeg,.png',
            maxFilesize: 4, // MB
            previewTemplate: '<div style="display: none"></div>',
            uploadMultiple: false,
            dictDefaultMessage: '',
        },
    };
    let $shade;

    function attachLightbox(element, opts) {
        const $element = $(element);
        const options = $.extend(true, {}, defaults, opts);
        $element.data('options', options);
		
        if(element.tagName !== 'IMG') {
            $element.addClass('ild-no-image');
            $element.html('Add Image<i class="fa fa-pencil"></i>');
        }

        $element.off('click').on('click', () => {
            openShade($element, element.tagName !== 'IMG');
        });
    }

    const openShade = ($element, forceDropzone = false) => {
        $('#ild-shade').remove();
        const URL = $element.attr('src');
        const options = $element.data('options');
        
        const shadeTemplate = `<div id="ild-shade" class="shade" style="display: none">
								<button class="closeBtn">+</button>
								<div>
									<div class="image-wrapper" style="${forceDropzone ? 'display: none' : ''}">
										<img id="shadeImg" src="${URL}" alt="">
										<div class="buttons">
										<a class="deleteBtn">
											<i class="fa fa-trash" aria-hidden="true"></i>
										</a>
										</div>
									</div>
									<div id="ild-dropzone" class="dropzone drop-area dropzone-file-area" style="${forceDropzone ? '' : 'display: none'}">
										<div class="dz-default dz-message">
											<h3>Drop new image here or click to upload</h3>
										</div>
									</div>
								</div>
							</div>`;

        $shade = $(shadeTemplate).appendTo('body');
        $shade.off('click').on('click', (event) => {
            if(event.target.className === 'shade') {
                closeShade();
            }
        });
        if(forceDropzone) {
            initDropzone(options);
        }
        $shade.find('.closeBtn').off('click').on('click', closeShade);
        $shade.find('.deleteBtn').off('click').on('click', () => {
            deleteImage(options);
        });
        $shade.fadeIn(150);
    };

    const closeShade = () => {
        $('#ild-shade').fadeOut(150, () => {
            $('#ild-shade').remove();
        });
    };

    const deleteImage = (options) => {
        $.ajax({
            url: options.ajax.url,
            method: options.ajax.method,
            data: options.ajax.data,
        })
            .done(() => {
                toastr.success('Image deleted successfully.');
                $shade.find('img').remove();
                $('.image-wrapper').hide();

                initDropzone(options);
                if(options.onDeleted) {
                    options.onDeleted();
                }
            })
            .fail((response) => {
                toastr.error(response.responseJSON.error || 'Image not updated.');
            });
    };

    const initDropzone = (options) => {
        const dropzoneConfig = $.extend(true, {}, options.dropzone, {
            init: function init() {
                this.on('success', (file, response) => {
                    if(response.status !== 'success') {
                        toastr.error(response.responseJSON.error || 'Image not updated.');
                        return false;
                    }
                    toastr.success('Image added successfully.');
                    closeShade();
                    if(options.onUploaded) {
                        options.onUploaded();
                    }
                    this.removeFile(file);
                });

                this.on('error', (file, err) => {
                    this.removeFile(file);
                    toastr.error(err.error || err || 'Error');
                });
            },
        });

        $shade.find('.dropzone').dropzone(dropzoneConfig).show();
    };

    $.fn.imageLightbox = function imageLightbox(options) {
        // Verify an empty collection wasn't passed.
        if(!this.length) {
            return this;
        }

        // Loop through each plugin object and attach Lightbox.
        return this.each(function attachImageLightbox() {
            attachLightbox(this, options);
        });
    };
}(jQuery));
