import type { LatLng } from 'leaflet'
import { NocoDBService, type ListResponse } from './nocodbService'
import type { Location } from '@/models/location'

export class LocationService {
  readonly nocoDBService: NocoDBService
  private readonly tableName = 'location'

  constructor(nocoDBService?: NocoDBService) {
    this.nocoDBService = nocoDBService || new NocoDBService()
    // Register the table with the ID from the cURL request
    this.nocoDBService.registerTable(this.tableName, 'mgnjjdbdzie74ur')
  }

  /**
   * Holt alle Standorte mit optionaler Paginierung
   */
  async getAllLocations(limit?: number, offset?: number): Promise<ListResponse<Location>> {
    const response = await this.nocoDBService.getRecords<Location>(this.tableName, {
      limit,
      offset,
      viewId: 'vwavvg6u07favtq4',
    })

    for (const loc of response.list) {
      if (loc.geoLocation) {
        loc.latLang = this.convertGeoPointToLatLngExpression(loc.geoLocation)
      }
    }
    console.log('Fetched locations:', response)
    return response
  }

  /**
   * Holt einen Standort anhand seiner ID
   */
  async getLocationById(id: string | number): Promise<Location> {
    const result = await this.nocoDBService.getRecord<Location>(this.tableName, id)
    if (result.geoLocation) {
      result.latLang = this.convertGeoPointToLatLngExpression(result.geoLocation)
    }
    return result
  }

  /**
   * Erstellt einen neuen Standort
   */
  async createLocation(location: Location) {
    const [createdLocation] = await this.nocoDBService.createRecords<Location, Location>(
      this.tableName,
      location,
    )
    return createdLocation
  }

  /**
   * Aktualisiert einen bestehenden Standort
   */
  async updateLocation(location: Location) {
    if (!location.id) {
      throw new Error('ID ist erforderlich für die Aktualisierung')
    }

    const [updatedLocation] = await this.nocoDBService.updateRecords<Location, Location>(
      this.tableName,
      location,
    )
    return updatedLocation
  }

  /**
   * Löscht einen Standort anhand seiner ID
   */
  async deleteLocation(id: string | number) {
    await this.nocoDBService.deleteRecords(this.tableName, id)
    return true
  }

  /**
   * Zählt die Anzahl der Standorte
   */
  async countLocations() {
    return this.nocoDBService.countRecords(this.tableName)
  }

  /**
   * Holt alle Standorte für einen bestimmten Baum
   */
  async getLocationsByTreeId(treeId: string | number): Promise<Location[]> {
    try {
      const response = await this.nocoDBService.getRecords<Location>(this.tableName, {
        where: `(tree_id,eq,${treeId})`,
        viewId: 'vwavvg6u07favtq4',
      })
      return response.list
    } catch (error) {
      console.error('Fehler beim Abrufen der Standorte für Baum:', error)
      return []
    }
  }

  private convertGeoPointToLatLngExpression(geoPoint: string): LatLng {
    if (!geoPoint) {
      console.warn('Empty geoPoint provided to convertGeoPointToLatLngExpression')
      // Return a default location to prevent errors (you may want to adjust this)
      return { lat: 47.73980909820898, lng: 8.970851784462777 } as LatLng
    }

    try {
      const [lat, lng] = geoPoint.split(';').map(Number)

      if (isNaN(lat) || isNaN(lng)) {
        console.warn(`Invalid geoPoint format: "${geoPoint}". Expected format: "lat;lng"`)
        return { lat: 47.73980909820898, lng: 8.970851784462777 } as LatLng
      }

      return { lat, lng } as LatLng
    } catch (error) {
      console.error('Error parsing geoPoint:', error, geoPoint)
      return { lat: 47.73980909820898, lng: 8.970851784462777 } as LatLng
    }
  }
}
