# -*- coding: utf-8 -*-
# Autor: PhanerJR
from __future__ import print_function
from modules.phantertagconstroi import MyTag
# import os
# from PIL import Image as PilImage
# from io import StringIO
# import base64
# import json


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


class PhanterGalleryInput(object):

    def __init__(self, url, cut_size=(300, 300), global_id=""):
        """
        @url: upload destination url

        @cut_size: Cut image size

        @global_id: Adds in all ids of the elements this id, in this way it is
            possible to add 2 distinct inputs without conflicts
        """
        super(PhanterGalleryInput, self).__init__()
        self.cut_size = cut_size
        self.title_button = "Upload Image"
        self._image_button = I(_class="phantersvg upload")
        self._global_id = ""

    @property
    def global_id(self):
        return self._global_id

    @global_id.setter
    def global_id(self, _id):
        if isinstance(_id, (str, int)):
            if isinstance(_id, str):
                _id = _id.strip()
                if " " in _id:
                    raise ValueError("The id can't have empty space")
            self._global_id = _id
        else:
            raise TypeError("The global_id must be string or int")

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
        title_button = self._title_button
        image_button = self._image_button
        ids_elements = {
            '_data-upload-area': 'phantergallery_upload-area',
            '_data-upload-form-container':
                'phantergallery_upload-form-container',
            '_data-upload-input': 'phantergallery_upload-input-file',
            '_data-upload-area-panel-cutter':
                'phantergallery-upload-area-panel-cutter',
            '_data-upload-area-target-view':
                'phantergallery-upload-area-target-view',
            '_data-upload-area-progress':
                'phantergallery-upload-area-progress',
        }
        if _id:
            for x in ids_elements:
                ids_elements[x] = "-".join([ids_elements[x], _id])

        html = DIV(
            DIV(
                DIV(
                    DIV(
                        DIV(image_button,
                            _class="phantergallery_upload-image-button"),
                        DIV(title_button,
                            _class="phantergallery_upload-title-button"),
                        _class="phantergallery_upload-button"
                    ),
                    _class="phantergallery_container-upload-button"
                ),
                _id=ids_elements['_data-upload-area'],
                _class="phantergallery_container-upload_area",
                **ids_elements
            ),
            DIV(
                INPUT(
                    _accept="image/png, image/jpeg, image/gif, image/bmp",
                    _id=ids_elements["_data-upload-input"],
                    _class="phantergallery_upload-input-file",
                ),
                _id=ids_elements["_data-upload-form-container"],
                _class="phantergallery_upload-form-container",
                _style="display: none;"
            ),
            DIV(_id=ids_elements['_data-upload-area-panel-cutter']),
            DIV(_id=ids_elements['_data-upload-area-target-view']),
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


if __name__ == '__main__':

    test = PhanterGalleryInput('/')
    test.global_id = "testef"
    print(test)