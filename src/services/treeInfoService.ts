import { NocoDBService, type ListResponse } from './nocodbService'

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
  readonly nocoDBService: NocoDBService
  private readonly tableName = 'treeInfo'

  constructor(nocoDBService?: NocoDBService) {
    this.nocoDBService = nocoDBService || new NocoDBService()
    this.nocoDBService.registerTable(this.tableName, 'msiujkp7wh01rvt')
  }

  /**
   * Ruft alle Baumeinträge ab
   * @param limit Maximale Anzahl der abzurufenden Einträge
   * @param offset Anzahl der zu überspringenden Einträge (für Paginierung)
   * @returns Liste von Baumeinträgen
   */
  async getAllTrees(limit?: number, offset?: number): Promise<ListResponse<TreeInfo>> {
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
   * Erstellt einen neuen Baumeintrag
   * @param treeInfo Daten für den neuen Baumeintrag
   * @returns Der erstellte Baumeintrag mit ID
   */
  async createTree(treeInfo: TreeInfo) {
    const [createdTree] = await this.nocoDBService.createRecords<TreeInfo, TreeInfo>(
      this.tableName,
      treeInfo,
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
      treeInfo,
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
}

export default TreeInfoService
