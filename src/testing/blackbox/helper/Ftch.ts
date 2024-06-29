export class Ftch {
  baseUrl
  constructor(url: string) {
    this.baseUrl = url
  }

  async ftch(url: string, options: object) {
    const r = await fetch(`${this.baseUrl}/${url}`, options)
    const body = await r.text()
    return {
      body,
      statuscode: r.status,
      url: r.url,
    }
  }

  get(endpoint: string, headers = {}) {
    return this.ftch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })
  }

  post(endpoint: string, body = {}, headers = {}) {
    return this.ftch(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })
  }

  put(endpoint: string, body = {}, headers = {}) {
    return this.ftch(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })
  }

  delete(endpoint: string, headers = {}) {
    return this.ftch(endpoint, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })
  }
}
