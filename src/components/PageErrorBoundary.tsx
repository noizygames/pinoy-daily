"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type PageErrorBoundaryProps = {
  children: ReactNode;
};

type PageErrorBoundaryState = {
  hasError: boolean;
};

export default class PageErrorBoundary extends Component<
  PageErrorBoundaryProps,
  PageErrorBoundaryState
> {
  state: PageErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): PageErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Pinoy Daily error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-dot-pattern flex min-h-full items-center justify-center px-4 py-10 font-sans">
          <div className="w-full max-w-[420px] rounded-2xl bg-white p-6 text-center shadow-sm">
            <p className="mb-2 text-3xl">😅</p>
            <h1 className="mb-2 text-xl font-bold text-neutral-900">
              May nangyaring mali
            </h1>
            <p className="mb-5 text-sm leading-relaxed text-neutral-600">
              Pasensya na! Nagkaproblema ang Pinoy Daily. I-refresh ang page at
              subukan ulit.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="min-h-[48px] rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-neutral-800"
            >
              I-refresh ang Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
