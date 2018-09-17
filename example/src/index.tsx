import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Window as DouglasWindow, WindowType } from '../../src';

import './style.css';

interface IFancyWindowState {
  windowType: WindowType;
  x: number;
  y: number;
}

class FancyWindow extends React.Component<{}, IFancyWindowState> {
  toolbarRef: React.RefObject<HTMLDivElement> = React.createRef();
  dragging = false;
  mouseX = 0;
  mouseY = 0;
  state = {
    windowType: WindowType.VIRTUAL,
    x: 100,
    y: 100,
  };

  handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.target === this.toolbarRef.current) {
      this.dragging = true;
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    }
  };

  handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (this.dragging) {
      e.preventDefault();
      const deltaX = e.clientX - this.mouseX;
      const deltaY = e.clientY - this.mouseY;

      this.setState(prevState => ({
        x: prevState.x + deltaX,
        y: prevState.y + deltaY,
      }));

      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    }
  };

  handleMouseUp = () => {
    this.dragging = false;
  };

  changeWindowType = (windowType: WindowType) => () =>
    this.setState({ windowType });

  render() {
    const { windowType, x, y } = this.state;
    return (
      <DouglasWindow
        windowType={windowType}
        x={x}
        y={y}
        width={640}
        height={480}
        className="window"
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'papayawhip',
          }}
        >
          <div
            onMouseDown={
              windowType === WindowType.VIRTUAL
                ? this.handleMouseDown
                : undefined
            }
            onMouseMove={
              windowType === WindowType.VIRTUAL
                ? this.handleMouseMove
                : undefined
            }
            onMouseUp={
              windowType === WindowType.VIRTUAL ? this.handleMouseUp : undefined
            }
            className="toolbar"
            ref={this.toolbarRef}
          >
            <button onClick={this.changeWindowType(WindowType.VIRTUAL)}>
              Virtual
            </button>
            <button onClick={this.changeWindowType(WindowType.TAB)}>Tab</button>
            <button onClick={this.changeWindowType(WindowType.WINDOW)}>
              Window
            </button>
          </div>
          Hello World!
        </div>
      </DouglasWindow>
    );
  }
}
class App extends React.Component<{}, {}> {
  render() {
    return <FancyWindow />;
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
