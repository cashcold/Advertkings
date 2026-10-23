import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 font-sans text-white">
          <div className="max-w-md w-full bg-zinc-900/90 border border-yellow-500/40 rounded-2xl p-6 text-center shadow-[0_0_30px_rgba(234,179,8,0.2)]">
            <div className="w-14 h-14 rounded-full bg-yellow-500/20 border border-yellow-400 flex items-center justify-center mx-auto mb-4 text-yellow-400">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black text-yellow-400 uppercase tracking-wide mb-2">
              Application Notice
            </h2>
            <p className="text-sm text-zinc-300 mb-6 leading-relaxed">
              The application encountered a temporary display issue. Click reload to refresh the workspace cleanly.
            </p>
            <button
              onClick={this.handleReload}
              className="w-full py-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-black text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>RELOAD APPLICATION</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

