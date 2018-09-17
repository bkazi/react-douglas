import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Window, { WindowType } from '../../src/Window';

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
        <Window
          windowType={this.state.windowType}
          x={100}
          y={100}
          width={640}
          height={480}
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
        </Window>
      </div>
    );
  }
}

console.log(Window);

ReactDOM.render(<App />, document.getElementById('app'));
