const MinVersion = '6.1'

export function requiresUpdate(currentVersion: string) {
  const current = currentVersion.split('.').map(Number)
  const target = MinVersion.split('.').map(Number)

  for (let i = 0; i < target.length; i++) {
    if (Number(current[i]) < Number(target[i])) {
      return true
    }
  }

  return false
}
