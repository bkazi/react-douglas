import * as React from 'react';
import * as ReactDOM from 'react-dom';

enum WindowType {
  VIRTUAL = 'VIRTUAL',
  TAB = 'TAB',
  WINDOW = 'WINDOW',
}

interface Props {
  scrollable?: boolean;

  // Controlling props
  windowType?: WindowType;
  title?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;

  // Initial set props
  initialWindowType?: WindowType;
  initialTitle?: string;
  initialX?: number;
  initialY?: number;
  initialWidth?: number;
  initialHeight?: number;

  className?: string;
}

interface State {
  windowType: WindowType;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

class Win extends React.Component<Props, State> {
  private container = document.createElement('div');
  private externalWindow: Window | null = null;

  public constructor(props: Props, ...args: any[]) {
    super(props, ...args);

    this.state = {
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

    if (this.props.windowType !== WindowType.VIRTUAL) {
      this.changeWindowType(
        this.props.windowType || this.state.windowType,
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
    if (
      this.props.windowType &&
      this.props.windowType !== prevProps.windowType
    ) {
      this.changeWindowType(
        this.props.windowType,
        prevProps.windowType || prevState.windowType
      );
    }
    if (
      !this.props.windowType &&
      this.state.windowType !== (prevProps.windowType || prevState.windowType)
    ) {
      this.changeWindowType(
        this.state.windowType,
        prevProps.windowType || prevState.windowType
      );
    }

    if (this.props.title && this.props.title !== prevProps.title) {
      this.changeTitle(this.props.title);
    }
    if (
      !this.props.title &&
      this.state.title !== (prevProps.title || prevState.title)
    ) {
      this.changeTitle(this.state.title);
    }

    if (this.props.x && this.props.x !== prevProps.x) {
      this.changeX(this.props.x);
    }
    if (!this.props.x && this.state.x !== (prevProps.x || prevState.x)) {
      this.changeX(this.state.x);
    }

    if (this.props.y && this.props.y !== prevProps.y) {
      this.changeY(this.props.y);
    }
    if (!this.props.y && this.state.y !== (prevProps.y || prevState.y)) {
      this.changeY(this.state.y);
    }

    if (this.props.width && this.props.width !== prevProps.width) {
      this.changeWidth(this.props.width);
    }
    if (
      !this.props.width &&
      this.state.width !== (prevProps.width || prevState.width)
    ) {
      this.changeWidth(this.state.width);
    }

    if (this.props.height && this.props.height !== prevProps.height) {
      this.changeHeight(this.props.height);
    }
    if (
      !this.props.height &&
      this.state.height !== (prevProps.height || prevState.height)
    ) {
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
        this.props.windowType === WindowType.TAB ? '_blank' : '',
        this.props.windowType === WindowType.WINDOW
          ? `width=${this.props.width || this.state.width},` +
            `height=${this.props.height || this.state.height},` +
            `left=${this.props.x || this.state.x},` +
            `top=${this.props.y || this.state.y},` +
            'channelmode=no,' +
            'location=no,' +
            'menubar=no,' +
            'resizable=yes,' +
            'titlebar=no,' +
            'toolbar=no'
          : undefined
      );

      if (this.externalWindow) {
        // this.externalWindow.addEventListener('unload', this.close);

        this.externalWindow.document.head.appendChild(
          this.externalWindow.document.createElement('title')
        );
        this.changeTitle(this.props.title || this.state.title);

        this.externalWindow.document.body.appendChild(this.container);
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

  private changeX(x: number) {
    if (
      this.externalWindow &&
      (this.props.windowType || this.state.windowType) === WindowType.WINDOW
    ) {
      this.externalWindow.moveTo(x, window.screenY || window.screenTop);
    }
  }

  private changeY(y: number) {
    if (
      this.externalWindow &&
      (this.props.windowType || this.state.windowType) === WindowType.WINDOW
    ) {
      this.externalWindow.moveTo(window.screenX || window.screenLeft, y);
    }
  }

  private changeWidth(width: number) {
    if (
      this.externalWindow &&
      (this.props.windowType || this.state.windowType) === WindowType.WINDOW
    ) {
      this.externalWindow.resizeTo(width, window.outerHeight);
    }
  }

  private changeHeight(height: number) {
    if (
      this.externalWindow &&
      (this.props.windowType || this.state.windowType) === WindowType.WINDOW
    ) {
      this.externalWindow.resizeTo(window.outerWidth, height);
    }
  }

  private renderVirtualWindow() {
    return (
      <div
        style={{
          position: 'absolute',
          overflow: this.props.scrollable ? 'auto' : 'hidden',
          left: `${this.props.x || this.state.x}px`,
          top: `${this.props.y || this.state.y}px`,
          width: `${this.props.width || this.state.width}px`,
          height: `${this.props.height || this.state.height}px`,
        }}
        className={this.props.className}
      >
        {this.props.children}
      </div>
    );
  }

  private renderPortalWindow() {
    if (this.props.className) {
      this.container.className = this.props.className;
    }
    return ReactDOM.createPortal(this.props.children, this.container);
  }

  public render() {
    switch (this.props.windowType) {
      case WindowType.VIRTUAL:
        return this.renderVirtualWindow();
      case WindowType.TAB:
      case WindowType.WINDOW:
        return this.renderPortalWindow();
    }
  }
}

export { Win as Window, WindowType };
