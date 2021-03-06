import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Window as DouglasWindow, WindowType } from '../../src';

import './style.css';

class App extends React.Component<{}, { windowType: WindowType }> {
  constructor(props: {}) {
    super(props);
    this.state = {
      windowType: WindowType.VIRTUAL,
    };
  }

  render() {
    return (
      <div>
        <button
          onClick={() => this.setState({ windowType: WindowType.VIRTUAL })}
        >
          Virtual
        </button>
        <button onClick={() => this.setState({ windowType: WindowType.TAB })}>
          Tab
        </button>
        <button
          onClick={() => this.setState({ windowType: WindowType.WINDOW })}
        >
          Window
        </button>
        <DouglasWindow
          windowType={this.state.windowType}
          x={100}
          y={100}
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
            HelloWorld!
          </div>
        </DouglasWindow>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
