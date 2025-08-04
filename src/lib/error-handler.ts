// Error handling utilities to prevent webpack errors

export class ErrorHandler {
  static handleWebpackError(error: any) {
    console.error('Webpack Error:', error);
    
    // Clear cache if webpack error occurs
    if (error.message && error.message.includes('webpack')) {
      console.log('Clearing cache due to webpack error...');
      this.clearCache();
    }
  }
  
  static clearCache() {
    try {
      // Clear localStorage if available
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
      
      // Clear sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
  
  static handleRuntimeError(error: any) {
    console.error('Runtime Error:', error);
    
    // Prevent infinite loops
    if (error.message && error.message.includes('a[d] is not a function')) {
      console.log('Detected webpack runtime error, clearing cache...');
      this.clearCache();
      window.location.reload();
    }
  }
  
  static setupErrorBoundary() {
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.handleRuntimeError(event.error);
      });
      
      window.addEventListener('unhandledrejection', (event) => {
        this.handleRuntimeError(event.reason);
      });
    }
  }
}

// Auto-setup error handling
if (typeof window !== 'undefined') {
  ErrorHandler.setupErrorBoundary();
} 