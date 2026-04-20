import React, { useState, useEffect, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const ErrorBoundary: React.FC<Props> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true);
      setError(event.error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    let message = "Something went wrong.";
    
    try {
      const parsed = JSON.parse(error?.message || "");
      if (parsed.operationType) {
        message = `Firebase Error: ${parsed.error}. Please check your permissions.`;
      }
    } catch (e) {
      // Not a JSON error
    }

    return (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900 p-6 text-center">
        <div className="max-w-md bg-white rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-black text-red-600 mb-4">Oops!</h2>
          <p className="text-slate-600 mb-6">{message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all"
          >
            Reload App
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
