import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

/**
 * Konfiguration für den API-Client
 */
export interface ApiClientConfig {
  baseURL: string;
  apiKey: string;
  timeout?: number;
}

/**
 * Basis-API-Client für HTTP-Anfragen an die NocoDB-API v2
 */
export class ApiClient {
  private client: AxiosInstance;

  constructor(config: ApiClientConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        'xc-token': config.apiKey // NocoDB v2 API verwendet 'xc-token' statt 'xc-auth'
      }
    });
  }

  /**
   * GET-Anfrage an die API
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.get<{ list?: T[], data?: T }>(url, config);
      // NocoDB v2 API gibt Daten in einem 'list' oder 'data' Objekt zurück
      return (response.data.list || response.data.data || response.data) as T;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * POST-Anfrage an die API
   */
  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.post<{ data?: T }>(url, data, config);
      // NocoDB v2 API gibt Daten in einem 'data' Objekt zurück
      return (response.data.data || response.data) as T;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * PUT-Anfrage an die API
   */
  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.put<{ data?: T }>(url, data, config);
      // NocoDB v2 API gibt Daten in einem 'data' Objekt zurück
      return (response.data.data || response.data) as T;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * PATCH-Anfrage an die API
   */
  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.patch<{ data?: T }>(url, data, config);
      // NocoDB v2 API gibt Daten in einem 'data' Objekt zurück
      return (response.data.data || response.data) as T;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * DELETE-Anfrage an die API
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.delete<{ data?: T }>(url, config);
      // NocoDB v2 API gibt Daten in einem 'data' Objekt zurück
      return (response.data.data || response.data) as T;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Fehlerbehandlung für API-Anfragen
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleError(error: any): void {
    if (error.response) {
      // Der Server hat mit einem Statuscode außerhalb des 2xx-Bereichs geantwortet
      console.error('API-Fehler:', error.response.status, error.response.data);
    } else if (error.request) {
      // Die Anfrage wurde gestellt, aber keine Antwort erhalten
      console.error('Keine Antwort vom Server:', error.request);
    } else {
      // Etwas ist bei der Anfrageerstellung schiefgegangen
      console.error('Anfragefehler:', error.message);
    }
  }
}

export default ApiClient;
