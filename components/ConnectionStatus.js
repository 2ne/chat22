export function ConnectionStatus({ connected }) {
  if (connected) return null

  return (
    <div className="p-2 bg-red-100 text-red-700 text-center">
      Disconnected from server. Trying to reconnect...
    </div>
  )
}