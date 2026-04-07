import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Resume render error:', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-6 p-10 bg-red-50/50 border border-red-100 rounded-xl">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <div className="text-center">
          <h3 className="font-bold text-gray-900 text-lg mb-2">Template Render Error</h3>
          <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
            This template encountered an error. Try switching to a different template, or reload the page.
          </p>
          {this.state.error?.message && (
            <code className="block mt-3 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg font-mono border border-red-100">
              {this.state.error.message}
            </code>
          )}
        </div>
        <button
          onClick={() => this.setState({ hasError: false, error: null })}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
        >
          <RefreshCw size={14} /> Try Again
        </button>
      </div>
    )
  }
}
