export async function getAllWines() {
  const response = await fetch('/api/wines')
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Failed to fetch wines: ${errorData.error}`)
  }
  return response.json()
}

export async function getWineById(id) {
  const response = await fetch(`/api/wines/${id}`)
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Failed to fetch wine: ${errorData.error}`)
  }
  return response.json()
}

export async function createWine(data) {
  const response = await fetch('/api/wines/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Failed to create wine: ${errorData.error}`)
  }
  return response.json()
}

export async function updateWine(id, data) {
  const response = await fetch(`/api/wines/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Failed to update wine: ${errorData.error}`)
  }
  return response.json()
}

export async function deleteWine(id) {
  const response = await fetch(`/api/wines/${id}`, { method: 'DELETE' })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Failed to delete wine: ${errorData.error}`)
  }
  return response.json()
}

export async function toggleWineDrunkStatus(id) {
  const response = await fetch(`/api/wines/${id}/toggle-drunk`, { method: 'POST' })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Failed to toggle wine drunk status: ${errorData.error}`)
  }
  return response.json()
}

export async function updateWineRating(id, rating) {
  const response = await fetch(`/api/wines/${id}/rating`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating }),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Failed to update wine rating: ${errorData.error}`)
  }
  return response.json()
}