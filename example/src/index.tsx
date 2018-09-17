import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Window as DouglasWindow, WindowType } from '../../src';

import './style.css';

class FancyWindow extends React.Component<{}, {}> {
  toolbarRef: React.RefObject<HTMLDivElement> = React.createRef();
  dragging = false;
  mouseX = 0;
  mouseY = 0;

  handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.target === this.toolbarRef.current) {
      this.dragging = true;
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    }
  };

  handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    {
      changeX,
      changeY,
    }: {
      changeX: ((x: (x: number) => number) => void);
      changeY: ((y: (y: number) => number) => void);
    }
  ) => {
    if (this.dragging) {
      e.preventDefault();
      const deltaX = e.clientX - this.mouseX;
      const deltaY = e.clientY - this.mouseY;

      changeX(x => x + deltaX);
      changeY(y => y + deltaY);

      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    }
  };

  handleMouseUp = () => {
    this.dragging = false;
  };

  render() {
    return (
      <DouglasWindow
        initialX={100}
        initialY={100}
        initialWidth={640}
        initialHeight={480}
        className="window"
      >
        {({ windowType, changeX, changeY, changeWindowType }) => (
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
                  ? e => this.handleMouseMove(e, { changeX, changeY })
                  : undefined
              }
              onMouseUp={
                windowType === WindowType.VIRTUAL
                  ? this.handleMouseUp
                  : undefined
              }
              className="toolbar"
              ref={this.toolbarRef}
            >
              <button onClick={() => changeWindowType(WindowType.VIRTUAL)}>
                Virtual
              </button>
              <button onClick={() => changeWindowType(WindowType.TAB)}>
                Tab
              </button>
              <button onClick={() => changeWindowType(WindowType.WINDOW)}>
                Window
              </button>
            </div>
            Hello World!
          </div>
        )}
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
