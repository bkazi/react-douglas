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
  windowType: WindowType;
  title?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  scrollable?: boolean;

  className?: string;
}

interface State {
  containerEl?: HTMLDivElement;
}

class Win extends React.Component<Props, State> {
  static defaultProps = {
    title: document.getElementsByTagName('title')[0].innerText,
    x: 0,
    y: 0,
    width: 10,
    height: 10,
    scrollable: true,
  };

  private externalWindow: Window | null = null;

  public componentDidMount() {
    window.addEventListener('beforeunload', this.onWindowClose);

    if (this.props.windowType !== WindowType.VIRTUAL) {
      this.changeWindowType(this.props.windowType, WindowType.VIRTUAL);
    }
  }

  public componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onWindowClose);
    if (this.externalWindow) {
      this.externalWindow.close();
    }
  }

  public componentDidUpdate(prevProps: Props) {
    if (this.props.windowType !== prevProps.windowType) {
      this.changeWindowType(this.props.windowType, prevProps.windowType);
    }

    if (this.props.title && this.props.title !== prevProps.title) {
      this.changeTitle(this.props.title);
    }

    if (this.props.x && this.props.x !== prevProps.x) {
      this.changeX(this.props.x);
    }

    if (this.props.y && this.props.y !== prevProps.y) {
      this.changeY(this.props.y);
    }

    if (this.props.width && this.props.width !== prevProps.width) {
      this.changeWidth(this.props.width);
    }

    if (this.props.height && this.props.height !== prevProps.height) {
      this.changeHeight(this.props.height);
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
        this.props.windowType === WindowType.TAB ? '_blank' : '',
        this.props.windowType === WindowType.WINDOW
          ? `width=${this.props.width},` +
            `height=${this.props.height},` +
            `left=${this.props.x},` +
            `top=${this.props.y},` +
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
        if (this.props.title) {
          this.changeTitle(this.props.title);
        }

        const containerEl = document.createElement('div');
        this.setState({ containerEl }, () => {
          document.body.appendChild(containerEl);
        });
      }
    }
  }

  private changeTitle(titleString: string) {
    if (this.externalWindow) {
      const title = this.externalWindow.document.getElementsByTagName(
        'title'
      )[0];
      title.innerText = titleString;
    }
  }

  private changeX = (x: number) => {
    if (this.externalWindow && this.props.windowType === WindowType.WINDOW) {
      this.externalWindow.moveTo(x, window.screenY || window.screenTop);
    }
  };

  private changeY = (y: number) => {
    if (this.externalWindow && this.props.windowType === WindowType.WINDOW) {
      this.externalWindow.moveTo(window.screenX || window.screenLeft, y);
    }
  };

  private changeWidth(width: number) {
    if (this.externalWindow && this.props.windowType === WindowType.WINDOW) {
      this.externalWindow.resizeTo(width, window.outerHeight);
    }
  }

  private changeHeight(height: number) {
    if (this.externalWindow && this.props.windowType === WindowType.WINDOW) {
      this.externalWindow.resizeTo(window.outerWidth, height);
    }
  }

  private renderVirtualWindow() {
    return (
      <div
        style={{
          position: 'absolute',
          overflow: this.props.scrollable ? 'auto' : 'hidden',
          left: `${this.props.x}px`,
          top: `${this.props.y}px`,
          width: `${this.props.width}px`,
          height: `${this.props.height}px`,
        }}
        className={this.props.className}
      >
        {this.props.children}
      </div>
    );
  }

  private renderPortalWindow() {
    const { containerEl } = this.state;

    if (containerEl === undefined) {
      return null;
    }

    if (this.props.className) {
      containerEl.className = this.props.className;
    }
    return ReactDOM.createPortal(this.props.children, containerEl);
  }

  public render() {
    switch (this.props.windowType) {
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
