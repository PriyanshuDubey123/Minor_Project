import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows fallback UI
    return { hasError: true, errorInfo: error };
  }

  componentDidCatch(error, info) {
    // Log error to an external service or console
    console.error("Error Caught by ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-center px-6">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Something Went Wrong</h1>
          <p className="text-lg text-gray-600 mb-6">
            An unexpected error has occurred. Try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
