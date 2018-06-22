# -*- coding: utf-8 -*-
# autor: PhanterJR


class MyTag(object):
    """
    Helper to constroi html tags.
    With this class you can create other predefined tags. Example:
    >>> class DIV(MyTag):
            def __init__(self, *content, **attributes):
                MyTag.__init__(self, 'div')
                self.singleton=False
                self.content=content
                self.attributes=attributes
    >>> print(DIV())
        <div></div>
    >>> print(DIV("My content", _class="my_atribute_class"))
        <div class="my_atribute_class">My content</div>
    """

    def __init__(self, tag, singleton=False, *content, **attributes):
        """
        @tag = name of tag. Example: div, img, br

        @singleton = if True, the tag does not need to close.

            Example:
                MyTag("br", True)
                    produce '<br>'
                MyTag("hr", True)
                    produce '<hr>'
                MyTag("img", True, _href="#my_url")
                    produce '<img href="#myurl">'
            if False, the tag will be close,
                MyTag("div")
                    produce '<div></div>'
                MyTag("h1", False, "My title")
                    produce '<h1>My title</h1>'
                MyTag("button", False, "my_content", _class="my_class")
                    produce '<button class="my_class">"my_content"</button>'

        @content = Content of element. exemple: MyTag("this is", " my content")

        @attributes = Element attributes. Each key of the attribute must begin
            with underline (_) (because of the keyword class and id),
            keys without underline will create a Exeption. Example:
            MyTag(_class="my_class", _style="display:block")
        """
        super(MyTag, self).__init__()
        self.tag = tag
        self.singleton = singleton
        self.content = content
        self.attributes = attributes

    @property
    def tag(self):
        """
        Get or Set tag of element
        Set:
            >>> new_tag=MyTag('div', False)
            >>> print(new_tag)
                <div></div>
            new_tag.tag='button'
            >>> print(new_tag)
                <button></button>

        Get:
            >>> new_tag=MyTag('div', False)
            >>> print(new_tag.tag)
                div
        """
        return self._tag

    @property
    def singleton(self):
        """
        Get or Set if element is singleon or not
        Set True:
            >>> new_tag=MyTag("br", True)
            >>> print(new_tag)
                <br>
            >>> new_tag=MyTag("hr", True)
            >>> print(new_tag)
                <hr>
            >>> new_tag=MyTag("img", True, _href="#my_url")
            >>> print(new_tag)
                <img href="#myurl">
        Set False:
            >>> new_tag=MyTag("div")
            >>> print(new_tag)
                <div></div>
            >>> new_tag=MyTag("h1", False, "My title")
            >>> print(new_tag)
                <h1>My title</h1>
            >>> new_tag=MyTag("button", False, "my_content", _class="my_class")
            >>> print(new_tag)
                <button class="my_class">"my_content"</button>
        Get:
            >>> new_tag=MyTag("button", False, "my_content", _class="my_class")
            >>> print(new_tag.singleton)
                False
        """
        return self._singleton

    @property
    def content(self):
        """
        Get or Set content of element.
        Set List:
            >>> new_tag=MyTag("div", False)
            >>> new_tag.content=['my', ' content']
            >>> print(new_tag)
                <div>my content</div>

        Set String:
            >>> new_tag=MyTag("div", False)
            >>> new_tag.content="my other content"
            >>> print(new_tag)
                <div>my other content</div>

        Set MyTag instance:
            >>> new_tag=MyTag("div", False)
            >>> other_tag=MyTag("a", False, "click here", _href="#my_url")
            >>> new_tag.content=other_tag
            >>> print(new_tag)
                <div><a href="#my_url">click here</a></div>
        """
        return self._content

    @property
    def attributes(self):
        """
        Get or Set atributes of tag element. Can set a dict(recomended)
            or a string.

        Set a dict:
            Each key of the attribute must begin with underline (_)
            (because of the keyword class and id), keys without underline
            will create a Exeption.
            Example:
                >>> new_tag=MyTag('div', False)
                >>> new_tag.attributes={"_class":"my_class", "_id":"my_id"}
                >>> print(new_tag)
                    <div class="my_class" id="my_id"></div>

        Set a string:
            Example:
                >>> new_tag.attributes='class="my_class_string"'
                >>> print(new_tag)
                    <div class="my_class_string"></div>

        Get:
            Example:
                >>> new_tag=MyTag('div', False)
                >>> new_tag.attributes={"_class":"my_class", "_id":"my_id"}
                >>> new_tag.attributes
                     class="my_class" id="my_id"
        """
        return self._attributes

    @tag.setter
    def tag(self, tag):
        if isinstance(tag, str):
            self._tag = tag
        else:
            raise TypeError("The tag must be string")

    @singleton.setter
    def singleton(self, singleton):
        if isinstance(singleton, bool):
            self._singleton = singleton
        else:
            raise TypeError("The singleton must be boolean")

    @content.setter
    def content(self, content):
        if isinstance(content, str):
            self._content = content
        elif isinstance(content, MyTag):
            self._content = content.xml
        elif isinstance(content, (list, tuple)):
            temp_content = ""
            for x in content:
                if isinstance(x, (str, MyTag)):
                    if isinstance(x, str):
                        temp_content = "".join([temp_content, x])
                    else:
                        temp_content = "".join([temp_content, x.xml])
                else:
                    raise TypeError("The elements of a content list or tuple \
                        must be strings or MyTag instances")

            self._content = temp_content
        else:
            raise TypeError(
                "The content must be a list, tuple, string or MyTag instance")

    @attributes.setter
    def attributes(self, attributes):
        print('veio aqui')
        if isinstance(attributes, str):
            self._attributes = " ".join(["", attributes.strip()])
        elif isinstance(attributes, type(None)):
            pass
        elif isinstance(attributes, dict):
            temp_atributes = {}
            for x in attributes:
                if x.startswith("_"):
                    if attributes[x] == None:
                        pass
                    else:
                        temp_atributes[x] = attributes[x]
                else:
                    raise TypeError(
                        "Keys of attributes must starts with underline '_'")
            self._attributes = self._make_attr_element(temp_atributes)
        else:
            raise TypeError("The attributes must be a dict")

    @property
    def xml(self):
        """
        Get xml(html) of element
            >>> new_tag=MyTag('div', False)
            >>> print(new_tag.xml)
            <div></div>
        """
        html = self._update_xml()
        self._xml = html
        return self._xml

    def _make_attr_element(self, dict_attr):
        attr_element = ""

        for x in dict_attr:
            attr_temp = "=".join(
                [x.replace("_", ""), "".join(['"', dict_attr[x], '"'])])
            attr_element = " ".join([attr_element, attr_temp])
        return attr_element

    def _update_xml(self):
        attr_element = self._attributes
        tag = self.tag
        if self._singleton:
            template = "<%(tag)s%(attributes)s>" % dict(
                tag=tag, attributes=attr_element)
        else:
            content = self.content
            template = "<%(tag)s%(attributes)s>%(content)s</%(tag)s>" % dict(
                tag=tag, attributes=attr_element, content=content)
        html = template
        return html

    def __str__(self):
        return self.xml

    def __repr__(self):
        return self.xml


if __name__ == '__main__':
    class DIV(MyTag):
        def __init__(self, *content, **attributes):
            MyTag.__init__(self, 'div')
            self.singleton = False
            self.content = content
            self.attributes = attributes
    print(DIV().xml)
