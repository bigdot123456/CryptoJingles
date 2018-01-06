import React, { Component } from 'react';
import { DragSource } from 'react-dnd'

import Pizzicato from 'pizzicato';

import './JingleBox.css';

const boxSource = {
  beginDrag(props) {
    return { name: props.name }
  },
};

const style = {
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  cursor: 'move',
  float: 'left',
};

@DragSource(props => props.type, boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
class JingleBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
        start: false
    };

    const sound = new Pizzicato.Sound(props.source, () => {
        // Sound loaded!
        sound.loop = true;
        this.state = {
            sound,
            start: false
        };
    });

  }

  playSound = () => {
      this.state.sound.play();

      this.setState({
          start: true
      });
  }

  stopSound = () => {
      this.state.sound.stop();

      this.setState({
        start: false
    });
  };

  render() {
    const { name, isDropped, isDragging, connectDragSource } = this.props;
    const opacity = isDragging ? 0.4 : 1;

    return connectDragSource(
        <div style={{ opacity, ...style }}>
          <div className="">
              <div className="well bs-component">
                  <div className="jingle-header">
                      <span className="text-success name-tag"> { this.props.name } </span>
                      <span className="id-tag pull-right"> #{ this.props.id } </span>
                  </div>
                <div>
                  {isDropped ? <s>{name}</s> : name}
                </div>

                  { !this.state.start &&
                      <svg viewBox="0 0 140 140" onClick={ this.playSound } >
                          <circle cx="70" cy="70" r="65" style={{fill:'#fff', stroke:'#ddd'}}/>
                          <polygon id="shape" points="50,40 100,70 100,70 50,100, 50,40" style={{fill:"#aaa"}}>
                          </polygon>
                      </svg>
                  }

                  { this.state.start &&
                      <svg viewBox="0 0 140 140" onClick={ this.stopSound }>
                          <circle cx="70" cy="70" r="65" style={{fill:'#fff', stroke:'#ddd'}}/>
                          <polygon id="shape" points="45,45 95,45 95,95, 45,95 45,45" style={{fill:"#aaa"}}>
                          </polygon>
                      </svg>
                  }
                  </div>
              </div>
        </div>
    )
  }
}

export default JingleBox;