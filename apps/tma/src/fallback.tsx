export function Fallback({
  error,
}: //   resetErrorBoundary,
{
  error: Error
  resetErrorBoundary: () => void
}) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <div style={{ color: 'red' }}>{error.message}</div>
      <div style={{ color: 'yellow' }}>{error.stack}</div>
    </div>
  )
}
