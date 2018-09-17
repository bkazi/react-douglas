import * as React from 'react';
import * as ReactDOM from 'react-dom';

enum WindowType {
  VIRTUAL = 'VIRTUAL',
  TAB = 'TAB',
  WINDOW = 'WINDOW',
}

interface RenderProps {
  changeX: (x: number | ((x: number) => number)) => void;
  changeY: (y: number | ((y: number) => number)) => void;
  changeWidth: (width: number) => void;
  changeHeight: (height: number) => void;
  changeWindowType: (windowType: WindowType) => void;
  windowType: WindowType;
}

interface Props {
  scrollable?: boolean;

  // Initial set props
  initialWindowType?: WindowType;
  initialTitle?: string;
  initialX?: number;
  initialY?: number;
  initialWidth?: number;
  initialHeight?: number;

  className?: string;
  children: (renderProps: RenderProps) => React.ReactChild;
}

interface State {
  windowType: WindowType;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  containerEl?: HTMLDivElement;
}

class Win extends React.Component<Props, State> {
  private externalWindow: Window | null = null;

  state = Win.getInitialState(this.props);

  static getInitialState(props: Props): State {
    return {
      windowType: props.initialWindowType || WindowType.VIRTUAL,
      title:
        props.initialTitle ||
        document.getElementsByTagName('title')[0].innerText,
      x: props.initialX || 0,
      y: props.initialY || 0,
      width: props.initialWidth || 10,
      height: props.initialHeight || 10,
    };
  }

  public componentDidMount() {
    window.addEventListener('beforeunload', this.onWindowClose);

    if (this.state.windowType !== WindowType.VIRTUAL) {
      this.changeWindowType(
        this.state.windowType || this.state.windowType,
        WindowType.VIRTUAL
      );
    }
  }

  public componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onWindowClose);
    if (this.externalWindow) {
      this.externalWindow.close();
    }
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.windowType !== prevState.windowType) {
      this.changeWindowType(this.state.windowType, prevState.windowType);
    }

    if (this.state.title !== prevState.title) {
      this.changeTitle(this.state.title);
    }

    if (this.state.x !== prevState.x) {
      this.changeX(this.state.x);
    }

    if (this.state.y !== prevState.y) {
      this.changeY(this.state.y);
    }

    if (this.state.width !== prevState.width) {
      this.changeWidth(this.state.width);
    }

    if (this.state.height !== prevState.height) {
      this.changeHeight(this.state.height);
    }
  }

  private onWindowClose = () => {
    if (this.externalWindow) {
      this.externalWindow.close();
    }
  };

  private changeWindowType(windowType: WindowType, prevWindowType: WindowType) {
    if (this.externalWindow && prevWindowType !== WindowType.VIRTUAL) {
      this.externalWindow.close();
    }

    if (windowType !== WindowType.VIRTUAL) {
      this.externalWindow = window.open(
        '',
        this.state.windowType === WindowType.TAB ? '_blank' : '',
        this.state.windowType === WindowType.WINDOW
          ? `width=${this.state.width},` +
            `height=${this.state.height},` +
            `left=${this.state.x},` +
            `top=${this.state.y},` +
            'channelmode=no,' +
            'location=no,' +
            'menubar=no,' +
            'resizable=yes,' +
            'titlebar=no,' +
            'toolbar=no'
          : undefined
      );

      if (this.externalWindow) {
        const { document } = this.externalWindow;
        // this.externalWindow.addEventListener('unload', this.close);

        document.head.appendChild(document.createElement('title'));
        this.changeTitle(this.state.title);

        const containerEl = document.createElement('div');
        this.setState({ containerEl }, () => {
          document.body.appendChild(containerEl);
        });
      }
    }
  }

  private renderChangeWindowType = (windowType: WindowType) => {
    this.setState({
      windowType,
    });
  };

  private changeTitle(titleString: string) {
    if (this.externalWindow) {
      const title = this.externalWindow.document.getElementsByTagName(
        'title'
      )[0];
      title.innerText = titleString;
    }
  }

  private changeX = (x: number) => {
    if (this.externalWindow && this.state.windowType === WindowType.WINDOW) {
      this.externalWindow.moveTo(x, window.screenY || window.screenTop);
    }
  };

  private renderChangeX = (x: number | ((x: number) => number)) => {
    if (typeof x === 'number') {
      this.setState({ x });
    } else {
      this.setState(prevState => ({
        x: x(prevState.x),
      }));
    }
  };

  private changeY = (y: number) => {
    if (this.externalWindow && this.state.windowType === WindowType.WINDOW) {
      this.externalWindow.moveTo(window.screenX || window.screenLeft, y);
    }
  };

  private renderChangeY = (y: number | ((y: number) => number)) => {
    if (typeof y === 'number') {
      this.setState({ y });
    } else {
      this.setState(prevState => ({
        y: y(prevState.y),
      }));
    }
  };

  private changeWidth(width: number) {
    if (this.externalWindow && this.state.windowType === WindowType.WINDOW) {
      this.externalWindow.resizeTo(width, window.outerHeight);
    }
  }

  private changeHeight(height: number) {
    if (this.externalWindow && this.state.windowType === WindowType.WINDOW) {
      this.externalWindow.resizeTo(window.outerWidth, height);
    }
  }

  private renderChildren() {
    return this.props.children({
      changeX: this.renderChangeX,
      changeY: this.renderChangeY,
      changeHeight: this.changeHeight,
      changeWidth: this.changeWidth,
      changeWindowType: this.renderChangeWindowType,
      windowType: this.state.windowType,
    });
  }

  private renderVirtualWindow() {
    return (
      <div
        style={{
          position: 'absolute',
          overflow: this.props.scrollable ? 'auto' : 'hidden',
          left: `${this.state.x}px`,
          top: `${this.state.y}px`,
          width: `${this.state.width}px`,
          height: `${this.state.height}px`,
        }}
        className={this.props.className}
      >
        {this.renderChildren()}
      </div>
    );
  }

  private renderPortalWindow() {
    const { containerEl } = this.state;

    if (!containerEl) {
      return null;
    }

    if (this.props.className) {
      containerEl.className = this.props.className;
    }
    return ReactDOM.createPortal(this.renderChildren(), containerEl);
  }

  public render() {
    switch (this.state.windowType) {
      case WindowType.VIRTUAL:
        return this.renderVirtualWindow();
      case WindowType.TAB:
      case WindowType.WINDOW:
        return this.renderPortalWindow();
      default:
        return null;
    }
  }
}

export { Win as Window, WindowType };
