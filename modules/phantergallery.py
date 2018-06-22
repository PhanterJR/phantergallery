# -*- coding: utf-8 -*-
# Autor: PhanerJR
from __future__ import print_function
from .phantertagconstroi import MyTag
import io
import os
from PIL import Image as PILImage


class DIV(MyTag):

    def __init__(self, *content, **attributes):
        MyTag.__init__(self, 'div')
        self.singleton = False
        self.content = content
        self.attributes = attributes


class I(MyTag):

    def __init__(self, *content, **attributes):
        MyTag.__init__(self, 'i')
        self.singleton = False
        self.content = content
        self.attributes = attributes


class INPUT(MyTag):

    def __init__(self, *content, **attributes):
        MyTag.__init__(self, 'input')
        self.singleton = True
        self.content = content
        self.attributes = attributes


class CANVAS(MyTag):

    def __init__(self, *content, **attributes):
        MyTag.__init__(self, 'canvas')
        self.singleton = False
        self.content = content
        self.attributes = attributes


class PhanterGalleryInput(object):

    def __init__(self, src_img="", cut_size=(300, 300), global_id=None, zindex=None):
        """
        @src_img: source_img

        @cut_size: Cut image size

        @global_id: Adds in all ids of the elements this id, in this way it is
            possible to add 2 distinct inputs without conflicts
        """
        super(PhanterGalleryInput, self).__init__()
        self.cut_size = cut_size
        self.title_button = "Upload Image"
        self._image_button = I(_class="phantersvg upload-cloud")
        self.global_id = global_id
        self._src_img = src_img
        self.zindex = zindex

    @property
    def zindex(self):
        return self._zindex

    @zindex.setter
    def zindex(self, value):
        if isinstance(value, (int, type(None))):
            self._zindex=value
        else:
            raise TypeError("The zindex value must be integer")

    @property
    def global_id(self):
        return self._global_id

    @global_id.setter
    def global_id(self, _id):
        if isinstance(_id, (str, int, type(None))):
            if isinstance(_id, str):
                _id = _id.strip()
                if " " in _id:
                    raise ValueError("The id can't have empty space")
            elif _id==None:
                self._global_id=""
            else:
                self._global_id = _id
        else:
            raise TypeError("The global_id must be string or integer or None")

    @property
    def title_button(self):
        """
        Get or Set title button
        """
        return self._title_button

    @title_button.setter
    def title_button(self, title):
        if isinstance(title, (str, MyTag)):
            if isinstance(title, MyTag):
                title = title.xml
            self._title_button = title
        else:
            raise TypeError("The title must be string")

    @property
    def image_button(self):
        """
        Get or Set title button
        """
        return self._image_button

    @image_button.setter
    def image_button(self, img_button):
        if isinstance(img_button, (str, MyTag)):
            if isinstance(img_button, MyTag):
                img_button = img_button.xml
            self._image_button = img_button
        else:
            raise TypeError("The image_button must be " +
                            "string or MyTag instance")

    @property
    def xml(self):
        global_id = self._global_id
        self._xml = self._html_input(global_id)
        return self._xml

    def _html_input(self, _id=""):
        zindex = self._zindex
        style_zindex = None
        if zindex:
            style_zindex = "z-index:%s;" % zindex
        title_button = self._title_button
        image_button = self._image_button
        cut_size = self.cut_size
        ids_elements = {
            '_data-object': 'phantergallery_object',
            '_data-upload-form-container':
                'phantergallery_upload-form-container',
            '_data-upload-input': 'phantergallery_upload-input-file',
            '_data-cutter-pad':
                'phantergallery_cutter-pad',
            '_data-cutter-background':
                'phantergallery_cutter-background',
            '_data-panel-cutter-container':
                'phantergallery_panel-cutter-container',
            '_data-cutter-shadow':
                'phantergallery_cutter-shadow',
            '_data-cutter-control-close':
                'phantergallery_cutter-control-close',
            '_data-cutter-control-view':
                'phantergallery_cutter-control-view',
            '_data-cutter-control-cut':
                'phantergallery_cutter-control-cut',
            '_data-panel-cutter-size-container':
                'phantergallery_panel-cutter-size-container',
            '_data-panel-cutter-image':
                'phantergallery_panel-cutter-image',
            '_data-cutter-zoom-control':
                'phantergallery_cutter-zoom-control',
            '_data-target-view':
                'phantergallery_target-view',
            '_data-target-view-container':
                'phantergallery_target-view-container',
            '_data-upload-messages':
                'phantergallery_upload-messages',
            '_data-upload-area-progress':
                'phantergallery_upload-area-progress',
            '_data-upload-image-button':
                'phantergallery_upload-image-button',
            '_data-upload-title-button':
                'phantergallery_upload-title-button',
            '_data-imagecuted-control-erase':
                'phantergallery-imagecuted-control-erase',
            '_data-imagecuted-control-change':
                'phantergallery-imagecuted-control-change',
        }
        if _id:
            for x in ids_elements:
                ids_elements[x] = "-".join([ids_elements[x], _id])
        ids_elements['_data-cutter-size-x'] = str(cut_size[0])
        ids_elements['_data-cutter-size-y'] = str(cut_size[1])
        ids_elements['_data-upload-src-img'] = self._src_img
        html = DIV(
            DIV(
                DIV(
                    DIV(
                        DIV(
                            I(_class="phantersvg recycle"),
                            _id=ids_elements["_data-imagecuted-control-erase"],
                            _class="phantergallery" +
                                   "_imagecuted-control"
                        ),
                        DIV(
                            I(_class="phantersvg reload-image"),
                            _id=ids_elements["_data-imagecuted" +
                                             "-control-change"],
                            _class="phantergallery" +
                                   "_imagecuted-control"
                        ),
                        _class="phantergallery" +
                               "_imagecuted-controls"),
                    CANVAS(_id=ids_elements['_data-target-view']),
                    _class='phantergallery-center-content',
                ),
                _id=ids_elements['_data-target-view-container'],
                _style="overflow: hidden; width: %spx; height: %spx;" %
                       (cut_size[0], cut_size[1]),
                _class="phantergallery_target-view-container%s" %
                       (" actived" if self._src_img else ""),
            ),
            DIV(
                DIV(
                    DIV(
                        DIV(image_button,
                            _id=ids_elements["_data-upload-image-button"],
                            _class="phantergallery_upload-image-button"),
                        DIV(title_button,
                            _id=ids_elements["_data-upload-title-button"],
                            _class="phantergallery_upload-title-button"),
                        _class="phantergallery_upload-button"
                    ),
                    _class="phantergallery_container-upload-button"
                ),
                _id=ids_elements['_data-object'],
                _class="phantergallery_object%s" %
                       (" actived" if not self._src_img else ""),
                **ids_elements
            ),
            DIV(
                INPUT(
                    _accept="image/png, image/jpeg, image/gif, image/bmp",
                    _id=ids_elements["_data-upload-input"],
                    _class="phantergallery_upload-input-file",
                    _type="file",
                ),
                _id=ids_elements["_data-upload-form-container"],
                _class="phantergallery_upload-form-container",
                _style="display: none;"
            ),
            DIV(
                DIV(_id=ids_elements["_data-cutter-background"],
                    _class="phantergallery_cutter-background"),
                DIV(_id=ids_elements["_data-cutter-shadow"],
                    _class="phantergallery_cutter-shadow"),
                DIV(
                    DIV(
                        DIV(
                            _class="phantergallery_panel-cutter-image",
                            _id=ids_elements['_data-panel-cutter-image']),

                        _style="overflow: hidden; width: %spx; height: %spx;" %
                               (cut_size[0], cut_size[1]),
                        _id=ids_elements['_data-panel-cutter-size-container'],
                        _class="phantergallery_panel-cutter-size-container"
                    ),
                    _class="phantergallery_panel-cutter"
                ),
                DIV(
                    _id=ids_elements['_data-cutter-pad'],
                    _class="phantergallery_cutter-pad"),
                DIV(
                    DIV(
                        I(_class="phantersvg close-circule"),
                        _id=ids_elements['_data-cutter-control-close'],
                        _class="phantergallery_cutter-control"),
                    DIV(
                        I(_class="phantersvg view-image"),
                        _id=ids_elements['_data-cutter-control-view'],
                        _class="phantergallery_cutter-control"),
                    DIV(
                        I(_class="phantersvg cut-image"),
                        _id=ids_elements['_data-cutter-control-cut'],
                        _class="phantergallery_cutter-control"),
                    _class='phantergallery_cutter-controls-container'),
                DIV(
                    DIV(
                        I(_class="phantersvg decrease-image"),
                        DIV(
                            DIV(_id=ids_elements['_data-cutter-zoom-control'],
                                _class="phantergallery_cutter-zoom-control"),
                            _class="phantergallery_cutter-zoom-control" +
                                   "-container"
                        ),
                        I(_class="phantersvg increase-image"),
                        _class='phantergallery_cutter-zoom-controls'),
                    _class='phantergallery_cutter-zoom-container'),
                _id=ids_elements['_data-panel-cutter-container'],
                _class="phantergallery_panel-cutter-container",
                _style=style_zindex
            ),
            DIV(_id=ids_elements['_data-upload-messages'],
                _class="phantergallery_upload-messages"),
            DIV(
                DIV(
                    DIV(
                        DIV(_class="phantergallery_progressbar-movement"),
                        _class="phantergallery_progressbar"),
                    _id=ids_elements['_data-upload-area-progress'],
                    _class="phantergallery_upload-area-progress"
                ),
                _class="phantergallery_progressbar-container"
            ),
            _class="phantergallery_inert-container"
        )
        return html.xml

    @property
    def cut_size(self):
        return self._cut_size

    @cut_size.setter
    def cut_size(self, cut_size):
        if isinstance(cut_size, (tuple, list)):
            if len(cut_size) == 2:
                if isinstance(cut_size[0], (int, float)) and \
                        isinstance(cut_size[1], (int, float)):
                    self._cut_size = (cut_size[0], cut_size[1])
                else:
                    raise TypeError("Values of list or tuple must be " +
                                    "integers or float")
            else:
                raise SyntaxError("There must be at least 2 values")
        else:
            raise TypeError("The value has to be a tuple or a list")

    def __str__(self):
        return self.xml

    def __repr__(self):
        return self.xml


class PhanterGalleryCutter(object):

    def __init__(self,
                 imageName,
                 imageType,
                 imageBytes,
                 cutterSizeX, cutterSizeY,
                 positionX, positionY,
                 newSizeX, newSizeY):
        self.imageName = imageName
        self.imageType = imageType
        self.imageBytes = imageBytes
        self.cutterSizeX = cutterSizeX
        self.cutterSizeY = cutterSizeY
        self.positionX = positionX
        self.positionY = positionY
        self.newSizeX = newSizeX
        self.newSizeY = newSizeY

    def getImage(self):
        imageBytes = self.imageBytes
        nome_da_imagem = self.imageName
        im = PILImage.open(imageBytes)
        newSizeX = int(float(self.newSizeX))
        newSizeY = int(float(self.newSizeY))
        cutterSizeX = float(self.cutterSizeX)
        cutterSizeY = float(self.cutterSizeY)
        positionX = float(self.positionX) * (-1)
        positionY = float(self.positionY) * (-1)
        extensao = os.path.splitext(nome_da_imagem)[1]
        im = im.resize((newSizeX, newSizeY),
                       PILImage.ANTIALIAS)
        im = im.crop((positionX, positionY,
                      positionX + cutterSizeX,
                      positionY + cutterSizeY))
        jpeg_image_buffer = io.BytesIO()
        if extensao.lower() == '.png':
            im.save(jpeg_image_buffer, 'png')
        else:
            im.save(jpeg_image_buffer, format='JPEG', quality=100)
        jpeg_image_buffer.seek(0)
        data = jpeg_image_buffer.read()
        return data


class PhanterGalleryImageCutObj(object):

    def __init__(self, imageBytes):
        self.imageBytes = imageBytes

    def getImage(self, formatOut='png'):
        im = PILImage.open(self.imageBytes)
        jpeg_image_buffer = io.BytesIO()
        if formatOut == 'png':
            im.save(jpeg_image_buffer, 'png')
        else:
            im.save(jpeg_image_buffer, format='JPEG', quality=100)
        jpeg_image_buffer.seek(0)
        data = jpeg_image_buffer.read()
        return data
