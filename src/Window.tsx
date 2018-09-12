import * as React from 'react';
import * as ReactDOM from 'react-dom';

enum WindowType {
  VIRTUAL = 'VIRTUAL',
  TAB = 'TAB',
  WINDOW = 'WINDOW',
}

interface Props {
  windowType: WindowType;
  title?: string;
}

interface State {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default class Win extends React.Component<Props, State> {
  private container = document.createElement('div');
  private externalWindow: Window | null = null;

  close() {
    console.log('closed');
  }

  componentDidMount() {
    if (this.props.windowType !== WindowType.VIRTUAL) {
      this.externalWindow = window.open(
        '',
        this.props.windowType === WindowType.TAB ? '_blank' : '',
      );

      if (this.externalWindow) {
        this.externalWindow.addEventListener('unload', this.close);

        const title = this.externalWindow.document.createElement('title');
        title.innerText = this.props.title || document.getElementsByTagName('title')[0].innerText;
        this.externalWindow.document.head.appendChild(title);

        this.externalWindow.document.body.appendChild(this.container);
      }
    }
  }

  componentWillUnmount() {
    if (this.externalWindow) {
      this.externalWindow.close();
    }
  }

  renderVirtualWindow() {
    return (
      <div
        style={{
          position: 'absolute',
          left: `${this.state.x}px`,
          top: `${this.state.y}px`,
          width: `${this.state.width}px`,
          height: `${this.state.height}px`,
        }}
      >
        {this.props.children}
      </div>
    );
  }

  renderPortalWindow() {
    return ReactDOM.createPortal(this.props.children, this.container);
  }

  render() {
    switch (this.props.windowType) {
      case WindowType.VIRTUAL:
        return this.renderVirtualWindow();
      case WindowType.TAB:
      case WindowType.WINDOW:
        return this.renderPortalWindow();
    }
  }
}
