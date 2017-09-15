import React, { Component } from 'react';
import './assets/css/Gesture.css';
class Gesture extends Component {
  constructor (props) {
    super(props);
    this.state = {
      cssWrapper: {
        height: props.height || '100px',
        width: props.width || '100px',
        left: props.left || 0,
        top: props.top || 0
      }
    };
    this.originPosition = {e: null, css: {},last: {}};
    this.handleMouseDown = this.handleMouseDown.bind(this);
  }
  componentDidMount () {
    document.addEventListener('click', (e) => {
      console.log('click')
      if (e.path && e.path.indexOf(this.refs.wrapper) === -1) {
        this.refs.wrapper.classList.remove('active');
        this.refs.wrapper.classList.remove('editable');
      } else if(!this.isChild(e.target, this.refs.wrapper)) {
        this.refs.wrapper.classList.remove('active');
        this.refs.wrapper.classList.remove('editable');
      } else {
        this.refs.wrapper.classList.add('active');
        this.refs.wrapper.classList.remove('editable');
      }
    });
    document.addEventListener('mouseup', (e) =>{
      this.originPosition = {e: null, css: {}};
    })
    document.addEventListener('mousemove', (e) =>{
      if (!this.originPosition.e) return;
      if (this.isMoveSame(e)) return;

      this.originPosition.last = {
        x: e.clientX,
        y: e.clientY
      }
      if (this.canMove(e)) {
        let x = e.clientX - this.originPosition.e.x;
        let y = e.clientY - this.originPosition.e.y;
        if (this.originPosition.e.target === this.refs.selectGesture) {
          this.setState({cssWrapper: {
            ...this.state.cssWrapper,
            left: this.getPx(this.originPosition.css.left, x),
            top: this.getPx(this.originPosition.css.top, y)
          }});
        } else if (this.hasGestureClass('line-right', 'point-right-middle')) {
          this.setState({cssWrapper: {...this.state.cssWrapper, width: this.getPx(this.originPosition.css.width, x)}});
        } else if (this.hasGestureClass('line-top', 'point-top-middle')) {
          this.setState({cssWrapper: {
            ...this.state.cssWrapper,
            height: this.getPx(this.originPosition.css.height, -y),
            top: this.getPx(this.originPosition.css.top, y)}});
        } else if (this.hasGestureClass('line-left', 'point-left-middle')) {
          this.setState({cssWrapper: {
            ...this.state.cssWrapper,
            width: this.getPx(this.originPosition.css.width, -x),
            left: this.getPx(this.originPosition.css.left, x)}
          });
        } else if (this.hasGestureClass('line-bottom', 'point-bottom-middle')) {
          this.setState({cssWrapper: {
            ...this.state.cssWrapper,
            height: this.getPx(this.originPosition.css.height, y)}
          });
        } else if (this.hasGestureClass('point-top-left', 'point-top-middle')) {
          this.setState({cssWrapper: {
            ...this.state.cssWrapper,
            width: this.getPx(this.originPosition.css.width, -x),
            left: this.getPx(this.originPosition.css.left, x),
            height: this.getPx(this.originPosition.css.height, -y),
            top: this.getPx(this.originPosition.css.top, y)}
          })
        } else if (this.hasGestureClass('point-top-right')) {
          this.setState({cssWrapper: {
            ...this.state.cssWrapper,
            width: this.getPx(this.originPosition.css.width, x),
            height: this.getPx(this.originPosition.css.height, -y),
            top: this.getPx(this.originPosition.css.top, y)}
          })
        } else if(this.hasGestureClass('point-bottom-left')) {
          this.setState({cssWrapper: {
            ...this.state.cssWrapper,
            width: this.getPx(this.originPosition.css.width, -x),
            left: this.getPx(this.originPosition.css.left, x),
            height: this.getPx(this.originPosition.css.height, y)
          }})
        } else if (this.hasGestureClass('point-bottom-right')) {
          this.setState({cssWrapper: {
            ...this.state.cssWrapper,
            width: this.getPx(this.originPosition.css.width, x),
            height: this.getPx(this.originPosition.css.height, y)
          }})
        } else if (this.hasGestureClass('point-rotate')) {
          this.setState({cssWrapper: {
            ...this.state.cssWrapper,
            transform: `rotate(${this.getRotate(e)})`
          }})
        }
      } 
    })
  }

  getRotate (e) {
    let point = this.getCenterPoint();
    let y = point.y - e.clientY;
    let x = e.clientX - point.x;
    let deg = Math.atan( Math.abs(x) / Math.abs(y)) * 180 / 3.141592653589793;
    if ( y <= 0 && x >= 0) {
      deg = 180 - deg;
    } else if ( y <= 0 && x <= 0) {
      deg = 180 + deg;
    } else if ( y >= 0 && x <= 0) {
      deg = 360 - deg;
    }
    return deg + 'deg';
  }

  getCenterPoint () {
    let point = this.refs.wrapper.getBoundingClientRect();
    return {
      x: point.left + this.originPosition.css.width / 2,
      y: point.top + this.originPosition.css.height / 2
    }
  }

  isChild (child, parent) {
    while (child.parentNode && child.parentNode.tagName && child.parentNode.tagName.downcase !== 'body') {
      if (child.parentNode === parent) {
        return true;
      } else {
        child = child.parentNode;
      }
    }
    return false;
  }

  handleMouseDown (e) {
    this.originPosition.e = {x: e.clientX, y: e.clientY, target: e.target};
    for(let k in this.state.cssWrapper) {
      this.originPosition.css[k] = parseInt(this.state.cssWrapper[k], 10);
    }
  }



  isMoveSame (e) {
    if (this.originPosition.last) {
      return this.originPosition.last.x === e.clientX && this.originPosition.last.y === e.clientY;
    } else {
      return false;
    }
  }

  canMove (e) {
    if (this.originPosition.e) {
      return true;
    } else {
      return false;
    }
  }

  hasGestureClass() {
    for(let i= 0, l =  arguments.length; i < l; i ++) {
      if(this.originPosition.e.target.classList.contains('gesture-' + arguments[i])){
        return true;
      }
    }
    return false
  }

  getPx(origin, from) {
    let len = origin + from;
    return len + 'px';
  }

  render() {
    return (
      <div ref='wrapper' className='gesture-wrapper' style={ this.state.cssWrapper }>
        <div className="gesture-content">
          {this.props.children}
        </div>
        <div className='gesture-select' ref='selectGesture' onDoubleClick={() => this.refs.wrapper.classList.add('editable')} onMouseDown={this.handleMouseDown}>
          <div className='gesture-point gesture-point-top-left' onMouseDown={this.handleMouseDown}></div>
          <div className='gesture-point gesture-point-top-right' onMouseDown={this.handleMouseDown}></div>
          <div className='gesture-point gesture-point-bottom-left' onMouseDown={this.handleMouseDown}></div>
          <div className='gesture-point gesture-point-bottom-right' onMouseDown={this.handleMouseDown}></div>
          <div className='gesture-line gesture-line-top' onMouseDown={this.handleMouseDown}>
            <div className='gesture-point gesture-point-top-middle'></div>
          </div>
          <div className='gesture-line gesture-line-left' onMouseDown={this.handleMouseDown}> 
            <div className='gesture-point gesture-point-left-middle'></div>
          </div>
          <div className='gesture-line gesture-line-right' onMouseDown={this.handleMouseDown}>
            <div className='gesture-point gesture-point-right-middle'></div>
          </div>
          <div className='gesture-line gesture-line-bottom' onMouseDown={this.handleMouseDown}>
            <div className='gesture-point gesture-point-bottom-middle'></div>
          </div>
          <div className='gesture-line gesture-line-rotate'></div>
          <div className='gesture-point gesture-point-rotate' onMouseDown={this.handleMouseDown}></div>
        </div>
      </div>
    );
  }
}

export default Gesture;
