(function (zn) {
    var tempElement = document.createElement('div'),
        tempStyle = tempElement.style;
    var rsizeElement = /width|height|top|right|bottom|left|size|margin|padding/i,
        rHasUnit = /[c-x%]/,
        PX = 'px',
        rUpperCameCase = /(?:^|-)([a-z])/g,
        rDeCameCase = /([A-Z])/g;

    var cssNumber = {
        'lineHeight': true,
        'zIndex': true,
        'zoom': true
    };

    var styleHooks = {
        float: 'cssFloat'
    };

    zn.style = zn.Class({
        static: true,
        methods: {
            each: function (target, callback, context) {
                if (target && callback) {
                    var length = target.length;
                    if (length >= 0) {
                        for (var i = 0; i < length; i++) {
                            callback.call(context, target[i], i);
                        }
                    }
                    else {
                        for (var key in target) {
                            if (target.hasOwnProperty(key)) {
                                callback.call(context, target[key], key);
                            }
                        }
                    }
                }
            },
            getCssText: function (inStyles) {
                var cssText = [''];
                this.each(inStyles,function (styleValue,styleName) {
                    cssText.push(this.getStyleProperty(styleName,true) + ':' + this.getStyleValue(styleName,styleValue));
                },this);
                return cssText.join(';');
            },
            getStyleValue: function (inName,inValue) {
                var property = this.getStyleProperty(inName);
                var value = inValue;
                if (rsizeElement.test(property)) {
                    if (!rHasUnit.test(inValue) && !cssNumber[property]) {
                        value += PX;
                    }
                }
                return value;
            },
            getStyleProperty: function (inName,isLowerCase) {
                var property = this.lowerCamelCase(inName);
                if (property in tempStyle) {
                    if (isLowerCase) {
                        property = this.deCamelCase(inName);
                    }
                } else {
                    if (isLowerCase) {
                        property = env.prefix()[1] + inName;
                    } else {
                        property = env.prefix()[0] + this.upperCamelCase(inName);
                    }
                }
                return styleHooks[inName] || property;
            },
            lowerCamelCase: function (inName) {
                var _camelizeString = this.upperCamelCase(inName);
                return _camelizeString.charAt(0).toLowerCase() + _camelizeString.substring(1);
            },
            upperCamelCase: function (inName) {
                return inName.replace(rUpperCameCase,function (match,group1) {
                    return group1.toUpperCase();
                });
            },
            deCamelCase: function (inName) {
                return inName.replace(rDeCameCase,function (match,group1) {
                    return '-' + group1.toLowerCase();
                });
            },
            capitalize: function (inString) {
                return inString.charAt(0).toUpperCase() + inString.slice(1);
            }
        }
    });

    zn.dom = zn.Class({
        static: true,
        methods: {
            hasClass: function (target, className) {
                return target.classList.contains(className);
            },
            addClass: function (target) {
                var classList = target.classList;
                arguments.shift();
                return classList.add.apply(classList, arguments);
            },
            removeClass: function (target) {
                var classList = target.classList;
                arguments.shift();
                return classList.remove.apply(classList, arguments);
            },
            toggleClass: function (target, inClassName) {
                return  target.classList.toggle(inClassName);
            },
            setStyle: function (target, inName, inValue) {
                var property = zn.style.getStyleProperty(inName);
                target.style[property] = zn.style.getStyleValue(inName,inValue);
            },
            getStyle: function (target, inName, isInline) {
                var element = target,
                    property = zn.style.getStyleProperty(inName),
                    styles = isInline ? target.style : (window.getComputedStyle?getComputedStyle(element, null):element.currentStyle);

                return styles[property] || '';
            },
            removeStyle: function (target, inName) {
                var property = zn.style.getStyleProperty(inName,true);
                target.style.removeProperty(property);
            },
            hasStyle: function (target, inName) {
                //todo:height/line-height
                //fix bug
                var cssText = target.style.cssText;
                return cssText.indexOf(inName + ':') > -1;
            },
            setStyles: function (target, inStyles) {
                target.style.cssText += zn.style.getCssText(inStyles);
            },
            getPosition: function (target){
                var _target = target,
                    _x = 0, _y = 0, _w = 0, _h = 0;

                if(_target.getBoundingClientRect){
                    var _bounding = _target.getBoundingClientRect();
                    _x = _bounding.left + Math.max(document.documentElement.scrollLeft, document.body.scrollLeft) - document.documentElement.clientLeft;
                    _y = _bounding.top + Math.max(document.documentElement.scrollTop, document.body.scrollTop) - document.documentElement.clientTop;
                    _w = _bounding.width;
                    _h = _bounding.height;
                } else {
                    while (_target != document.body) {
                        if(!_target){ break; }
                        _x += _target.offsetLeft;
                        _y += _target.offsetTop;
                        _target = _target.offsetParent;
                    }
                    _w = _target.offsetWidth;
                    _h = _target.offsetHeight;
                }

                /*
                while (_target != document.body) {
                    if(!_target){ break; }
                    _x += _target.offsetLeft + _target.scrollLeft || 0;
                    _y += _target.offsetTop + _target.scrollTop || 0;
                    _target = _target.offsetParent;
                }
                _w = target.offsetWidth;
                _h = target.offsetHeight;*/

                return {
                    x: _x,
                    y: _y,
                    width: _w,
                    height: _h
                };
            },
            on: function(target, event, handler){
                if (target.addEventListener) {
                    target.addEventListener(event, handler, false);
                } else if (element.attachEvent) {
                    target.attachEvent('on' + event, handler);
                } else {
                    target['on' + event] = handler;
                }
            },
            off:function(target, event, handler){
                if (target.removeEventListener) {
                    target.removeEventListener(event, handler, false);
                } else if (target.detachEvent) {
                    target.detachEvent('on' + event, handler);
                } else {
                    target['on' + event] = null;
                }
            }
        }
    });

})(zn);
