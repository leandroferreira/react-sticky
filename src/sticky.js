import React from 'react';
import ReactDOM from 'react-dom';

export default class Sticky extends React.Component {

  static contextTypes = {
    container: React.PropTypes.any,
    offset: React.PropTypes.number,
    rect: React.PropTypes.object
  }

  static defaultProps = {
    className: '',
    style: {},
    stickyClassName: 'sticky',
    stickyStyle: {},
    topOffset: 0,
    bottomOffset: 0,
    scrollElement: window,
    onStickyStateChange: function () {}
  }

  constructor(props) {
    super(props);

    this.state = {
      isSticky: false
    };
  }

  componentDidMount() {
    this.update();
    this.on(this.props.scrollElement, ['scroll', 'touchstart', 'touchmove', 'touchend'], this.onScroll);
    this.on(window, ['pageshow', 'load'], this.onScroll);
    this.on(window, ['resize', 'pageshow', 'load'], this.onResize);
  }

  componentWillReceiveProps() {
    this.update();
  }

  componentWillUnmount() {
    this.off(this.props.scrollElement, ['scroll', 'touchstart', 'touchmove', 'touchend'], this.onScroll);
    this.off(window, ['pageshow', 'load'], this.onScroll);
    this.off(window, ['resize', 'pageshow', 'load'], this.onResize);
  }

  getOrigin(pageY) {
    return this.refs.placeholder.getBoundingClientRect().top + pageY;
  }

  getPageY() {
    const element = this.props.scrollElement;
    return element.pageYOffset || element.scrollTop;
  }

  update() {
    const height = ReactDOM.findDOMNode(this).getBoundingClientRect().height;
    const pageY = this.getPageY();
    const origin = this.getOrigin(pageY);
    const isSticky = this.isSticky(pageY, origin);
    this.setState({ height, origin, isSticky });
  }

  isSticky(pageY, origin) {
    return pageY + this.context.offset - this.props.topOffset >= origin
      && this.context.offset <= (this.context.rect.bottom || 0) - this.props.bottomOffset;
  }

  onScroll = () => {
    const pageY = this.getPageY();
    const origin = this.getOrigin(pageY);
    const isSticky = this.isSticky(pageY, this.state.origin);
    const hasChanged = this.state.isSticky !== isSticky;

    this.setState({ isSticky, origin });
    this.context.container.updateOffset(isSticky ? this.state.height : 0);

    if (hasChanged) this.props.onStickyStateChange(isSticky);
  }

  onResize = () => {
    const height = ReactDOM.findDOMNode(this).getBoundingClientRect().height;
    const origin = this.getOrigin(this.getPageY());
    this.setState({ height, origin });
  }

  on(element, events, callback) {
    events.forEach((evt) => {
      element.addEventListener(evt, callback);
    });
  }

  off(element, events, callback) {
    events.forEach((evt) => {
      element.removeEventListener(evt, callback);
    });
  }

  /*
   * The special sauce.
   */
  render() {
    const isSticky = this.state.isSticky;

    let className = this.props.className;
    if (isSticky) className += ` ${this.props.stickyClassName}`;

    let style = this.props.style;
    if (isSticky) {
      const placeholderRect = this.refs.placeholder.getBoundingClientRect();
      const stickyStyle = {
        position: 'fixed',
        top: this.context.offset,
        left: placeholderRect.left,
        width: placeholderRect.width
      };

      const bottomLimit = (this.context.rect.bottom || 0) - this.state.height - this.props.bottomOffset;
      if (this.context.offset > bottomLimit) {
        stickyStyle.top = bottomLimit;
      }

      style = Object.assign({}, this.props.style, stickyStyle, this.props.stickyStyle);
    }

    return (
      <div>
        <div ref="placeholder" style={{ paddingBottom: isSticky ? this.state.height : 0 }}></div>
        <div {...this.props} className={className} style={style}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
