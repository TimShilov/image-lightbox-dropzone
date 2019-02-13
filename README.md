image-lightbox-dropzone
========

### Tiny image lightbox plugin with ability to delete or upload new files via ajax (jQuery plugin)

This plugin is an experimental example and IS under active development. If it suits your requirements feel free to expand upon it!

## Requirements

* jQuery v3+
* Dropzone

## Install

```html
<link href=".../imageLightbox/imageLightbox.css" rel="stylesheet" type="text/css">

<script src="assets/global/plugins/jquery.min.js"></script>
<script src="assets/global/plugins/dropzone/dropzone.min.js"></script>
<script src="assets/global/plugins/imageLightbox/imageLightbox.js"></script>
```

## Usage

Add any element on the page:
```html
<!-- This is a placeholder without image showing dropzone on click -->
<span class="image-lightbox-dropzone">Click here to upload image</span>

<!-- This image will open in lightbox with ability to delete it -->
<img src="https://picsum.photos/200/300" class="image-lightbox-dropzone" alt="Nice image" />
```

Then activate with jQuery like so:
```js
$('.image-lightbox-dropzone').imageLightbox({
					onDeleted: () => { alert('Image successfully deleted'); },
					onUploaded: () => { alert('New image successfully uploaded'); },
					ajax: {
						method: 'DELETE',
						url: '/api/test',
						data: {
							// any payload data
						},
					},
					dropzone: {
						url: `/api/test`,
					},
				});
```