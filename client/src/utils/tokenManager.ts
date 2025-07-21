class TokenManager {
  private accessToken: string | null = null;

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  clearAccessToken() {
    this.accessToken = null;
  }

  async refreshAccessToken(): Promise<string | null> {
    try {
      const response = await fetch('/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        this.setAccessToken(data.accessToken);
        return data.accessToken;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }

    return null;
  }
}

export const tokenManager = new TokenManager();
