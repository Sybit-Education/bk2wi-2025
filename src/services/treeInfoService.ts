import { NocoDBService } from './nocodbService'

/**
 * Interface für die Daten in der TREE_INFO Tabelle
 */
export interface TreeInfo {
  id?: string | number
  name?: string
  species?: string
  height?: number
  diameter?: number
  age?: number
  health_status?: string
  location?: string
  planted_date?: string
  last_inspection?: string
  notes?: string
  [key: string]: unknown
}

/**
 * Service für den Zugriff auf die TREE_INFO Tabelle
 */
export class TreeInfoService {
  private readonly nocoDBService: NocoDBService
  private readonly tableName = 'treeInfo'

  constructor(nocoDBService?: NocoDBService) {
    this.nocoDBService = nocoDBService || NocoDBService.getInstance()
  }

  /**
   * Ruft alle Baumeinträge ab
   * @param limit Maximale Anzahl der abzurufenden Einträge
   * @param offset Anzahl der zu überspringenden Einträge (für Paginierung)
   * @returns Liste von Baumeinträgen
   */
  async getAllTrees(limit?: number, offset?: number) {
    return this.nocoDBService.getRecords<TreeInfo>(this.tableName, { limit, offset })
  }

  /**
   * Ruft einen Baumeintrag anhand seiner ID ab
   * @param id ID des Baumeintrags
   * @returns Der angeforderte Baumeintrag
   */
  async getTreeById(id: string | number) {
    return this.nocoDBService.getRecord<TreeInfo>(this.tableName, id)
  }

  /**
   * Sucht Bäume anhand verschiedener Kriterien
   * @param criteria Suchkriterien
   * @returns Liste von Baumeinträgen, die den Kriterien entsprechen
   */
  async searchTrees(criteria: Partial<TreeInfo>) {
    // Erstelle WHERE-Bedingung aus den Kriterien
    const conditions = Object.entries(criteria)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => {
        // Für Textfelder verwenden wir 'like', für andere 'eq'
        const operator = typeof value === 'string' ? 'like' : 'eq'
        const searchValue = typeof value === 'string' ? `%${value}%` : value
        return `(${key},${operator},${searchValue})`
      })

    if (conditions.length === 0) {
      return this.getAllTrees()
    }

    const whereClause = conditions.join('~and')
    return this.nocoDBService.getRecords<TreeInfo>(this.tableName, { where: whereClause })
  }

  /**
   * Erstellt einen neuen Baumeintrag
   * @param treeInfo Daten für den neuen Baumeintrag
   * @returns Der erstellte Baumeintrag mit ID
   */
  async createTree(treeInfo: TreeInfo) {
    const [createdTree] = await this.nocoDBService.createRecords<TreeInfo, TreeInfo>(
      this.tableName,
      treeInfo
    )
    return createdTree
  }

  /**
   * Aktualisiert einen bestehenden Baumeintrag
   * @param treeInfo Daten für die Aktualisierung (muss ID enthalten)
   * @returns Der aktualisierte Baumeintrag
   */
  async updateTree(treeInfo: TreeInfo) {
    if (!treeInfo.id) {
      throw new Error('ID ist erforderlich für die Aktualisierung')
    }

    const [updatedTree] = await this.nocoDBService.updateRecords<TreeInfo, TreeInfo>(
      this.tableName,
      treeInfo
    )
    return updatedTree
  }

  /**
   * Löscht einen Baumeintrag anhand seiner ID
   * @param id ID des zu löschenden Baumeintrags
   * @returns true bei Erfolg
   */
  async deleteTree(id: string | number) {
    await this.nocoDBService.deleteRecords(this.tableName, id)
    return true
  }

  /**
   * Zählt die Anzahl der Baumeinträge
   * @returns Die Anzahl der Baumeinträge
   */
  async countTrees() {
    return this.nocoDBService.countRecords(this.tableName)
  }

  /**
   * Filtert Bäume nach Gesundheitszustand
   * @param status Gesundheitszustand (z.B. 'healthy', 'sick', 'critical')
   * @returns Liste von Baumeinträgen mit dem angegebenen Gesundheitszustand
   */
  async getTreesByHealthStatus(status: string) {
    return this.nocoDBService.getRecords<TreeInfo>(this.tableName, {
      where: `(health_status,eq,${status})`
    })
  }

  /**
   * Filtert Bäume nach Baumart
   * @param species Baumart
   * @returns Liste von Baumeinträgen der angegebenen Baumart
   */
  async getTreesBySpecies(species: string) {
    return this.nocoDBService.getRecords<TreeInfo>(this.tableName, {
      where: `(species,like,%${species}%)`
    })
  }

  /**
   * Filtert Bäume nach Standort
   * @param location Standort
   * @returns Liste von Baumeinträgen am angegebenen Standort
   */
  async getTreesByLocation(location: string) {
    return this.nocoDBService.getRecords<TreeInfo>(this.tableName, {
      where: `(location,like,%${location}%)`
    })
  }

  /**
   * Ruft Bäume ab, die seit einem bestimmten Datum nicht mehr inspiziert wurden
   * @param date Datum im ISO-Format (YYYY-MM-DD)
   * @returns Liste von Baumeinträgen, die seit dem angegebenen Datum nicht inspiziert wurden
   */
  async getTreesNotInspectedSince(date: string) {
    return this.nocoDBService.getRecords<TreeInfo>(this.tableName, {
      where: `(last_inspection,lt,${date})`
    })
  }
}

// Singleton-Instanz für den TreeInfoService
let instance: TreeInfoService | null = null

// Factory-Methode für Singleton-Zugriff
export function useTreeInfoService(): TreeInfoService {
  if (!instance) {
    instance = new TreeInfoService()
  }
  return instance
}

export default TreeInfoService
