'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Sticky = function (_React$Component) {
  _inherits(Sticky, _React$Component);

  function Sticky(props) {
    _classCallCheck(this, Sticky);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Sticky).call(this, props));

    _this.onScroll = function () {
      var pageY = _this.getPageY();
      var origin = _this.getOrigin(pageY);
      var isSticky = _this.isSticky(pageY, _this.state.origin);
      var hasChanged = _this.state.isSticky !== isSticky;

      _this.setState({ isSticky: isSticky, origin: origin });
      _this.context.container.updateOffset(isSticky ? _this.state.height : 0);

      if (hasChanged) _this.props.onStickyStateChange(isSticky);
    };

    _this.onResize = function () {
      var height = _reactDom2.default.findDOMNode(_this).getBoundingClientRect().height;
      var origin = _this.getOrigin(_this.getPageY());
      _this.setState({ height: height, origin: origin });
    };

    _this.state = {
      isSticky: false
    };
    return _this;
  }

  _createClass(Sticky, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.update();
      this.on(this.props.scrollElement, ['scroll', 'touchstart', 'touchmove', 'touchend'], this.onScroll);
      this.on(window, ['pageshow', 'load'], this.onScroll);
      this.on(window, ['resize', 'pageshow', 'load'], this.onResize);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps() {
      this.update();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.off(this.props.scrollElement, ['scroll', 'touchstart', 'touchmove', 'touchend'], this.onScroll);
      this.off(window, ['pageshow', 'load'], this.onScroll);
      this.off(window, ['resize', 'pageshow', 'load'], this.onResize);
    }
  }, {
    key: 'getOrigin',
    value: function getOrigin(pageY) {
      return this.refs.placeholder.getBoundingClientRect().top + pageY;
    }
  }, {
    key: 'getPageY',
    value: function getPageY() {
      var element = this.props.scrollElement;
      return element.pageYOffset || element.scrollTop;
    }
  }, {
    key: 'update',
    value: function update() {
      var height = _reactDom2.default.findDOMNode(this).getBoundingClientRect().height;
      var pageY = this.getPageY();
      var origin = this.getOrigin(pageY);
      var isSticky = this.isSticky(pageY, origin);
      this.setState({ height: height, origin: origin, isSticky: isSticky });
    }
  }, {
    key: 'isSticky',
    value: function isSticky(pageY, origin) {
      return pageY + this.context.offset - this.props.topOffset >= origin && this.context.offset <= (this.context.rect.bottom || 0) - this.props.bottomOffset;
    }
  }, {
    key: 'on',
    value: function on(element, events, callback) {
      events.forEach(function (evt) {
        element.addEventListener(evt, callback);
      });
    }
  }, {
    key: 'off',
    value: function off(element, events, callback) {
      events.forEach(function (evt) {
        element.removeEventListener(evt, callback);
      });
    }

    /*
     * The special sauce.
     */

  }, {
    key: 'render',
    value: function render() {
      var isSticky = this.state.isSticky;

      var className = this.props.className;
      if (isSticky) className += ' ' + this.props.stickyClassName;

      var style = this.props.style;
      if (isSticky) {
        var placeholderRect = this.refs.placeholder.getBoundingClientRect();
        var stickyStyle = {
          position: 'fixed',
          top: this.context.offset,
          left: placeholderRect.left,
          width: placeholderRect.width
        };

        var bottomLimit = (this.context.rect.bottom || 0) - this.state.height - this.props.bottomOffset;
        if (this.context.offset > bottomLimit) {
          stickyStyle.top = bottomLimit;
        }

        style = _extends({}, this.props.style, stickyStyle, this.props.stickyStyle);
      }

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement('div', { ref: 'placeholder', style: { paddingBottom: isSticky ? this.state.height : 0 } }),
        _react2.default.createElement(
          'div',
          _extends({}, this.props, { className: className, style: style }),
          this.props.children
        )
      );
    }
  }]);

  return Sticky;
}(_react2.default.Component);

Sticky.contextTypes = {
  container: _react2.default.PropTypes.any,
  offset: _react2.default.PropTypes.number,
  rect: _react2.default.PropTypes.object
};
Sticky.defaultProps = {
  className: '',
  style: {},
  stickyClassName: 'sticky',
  stickyStyle: {},
  topOffset: 0,
  bottomOffset: 0,
  scrollElement: window,
  onStickyStateChange: function onStickyStateChange() {}
};
exports.default = Sticky;
module.exports = exports['default'];