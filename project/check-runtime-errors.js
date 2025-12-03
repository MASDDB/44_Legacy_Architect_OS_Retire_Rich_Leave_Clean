// Runtime error checker - place this at the top of index.jsx temporarily
window.addEventListener('error', (event) => {
  console.error('🔴 Global Error:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('🔴 Unhandled Promise Rejection:', event.reason);
});

// Check if React root element exists
setTimeout(() => {
  const root = document.getElementById('root');
  console.log('Root element:', root);
  console.log('Root HTML:', root?.innerHTML?.substring(0, 200) || 'EMPTY');
  console.log('Root children count:', root?.children?.length || 0);
}, 1000);
