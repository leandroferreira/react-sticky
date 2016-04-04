'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Container = function (_React$Component) {
  _inherits(Container, _React$Component);

  function Container(props) {
    _classCallCheck(this, Container);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Container).call(this, props));

    _this.state = {
      offset: 0,
      rect: {}
    };
    return _this;
  }

  _createClass(Container, [{
    key: 'getChildContext',
    value: function getChildContext() {
      var container = this;
      var totalOffset = (this.context.totalOffset || 0) + this.state.offset;
      var offset = totalOffset - this.state.offset;
      var rect = this.state.node ? this.state.node.getBoundingClientRect() : {};
      return { container: container, totalOffset: totalOffset, offset: offset, rect: rect };
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var node = _reactDom2.default.findDOMNode(this);
      this.setState({ node: node });
    }
  }, {
    key: 'updateOffset',
    value: function updateOffset(offset) {
      this.setState({ offset: offset });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        this.props,
        this.props.children
      );
    }
  }]);

  return Container;
}(_react2.default.Component);

Container.contextTypes = {
  container: _react2.default.PropTypes.any,
  totalOffset: _react2.default.PropTypes.number
};
Container.childContextTypes = {
  container: _react2.default.PropTypes.any,
  totalOffset: _react2.default.PropTypes.number,
  offset: _react2.default.PropTypes.number,
  rect: _react2.default.PropTypes.any
};
exports.default = Container;
module.exports = exports['default'];