const API_URL = import.meta.env.VITE_API_URL

export const saleOffService = {
  // Get all sale-offs with filters
  async getSaleOffs(limit = 10, offset = 0, filters = {}) {
    const params = new URLSearchParams()
    params.append("limit", limit)
    params.append("offset", offset)

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        params.append(key, value)
      }
    })

    const response = await fetch(`${API_URL}/sale-offs?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch sale offs")
    }

    return await response.json()
  },

  // Get sale-off count
  async getSaleOffCount(filters = {}) {
    const params = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        params.append(key, value)
      }
    })

    const response = await fetch(`${API_URL}/sale-offs/count?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch sale off count")
    }

    return await response.json()
  },

  // Create new sale-off
  async createSaleOff(saleOffData) {
    const response = await fetch(`${API_URL}/sale-offs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(saleOffData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to create sale off")
    }

    return await response.json()
  },

  // Update sale-off
  async updateSaleOff(id, saleOffData) {
    const response = await fetch(`${API_URL}/sale-offs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(saleOffData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to update sale off")
    }

    return await response.json()
  },

  // Delete sale-off
  async deleteSaleOff(id) {
    const response = await fetch(`${API_URL}/sale-offs/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to delete sale off")
    }

    return await response.json()
  },
}
