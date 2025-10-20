import { NocoDBService, type ListResponse } from './nocodbService'
import type { TreeInfo } from '@/models/treeInfo'
import type { Picture } from '@/models/picture'

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

  /**
   * Ruft die Bilder für einen bestimmten Baum ab
   * @param treeId ID des Baums
   * @returns Liste von Bildern für den angegebenen Baum
   */
  async getTreePictures(treeId: string | number): Promise<Picture[]> {
    try {
      // Hier müsste die korrekte Tabellen-ID und Verknüpfungsfeld-ID eingetragen werden
      const response = await this.nocoDBService.getLinkedRecords<Picture>(
        this.tableName,
        'pictures', // Verknüpfungsfeld-ID
        treeId
      )
      return response.list
    } catch (error) {
      console.error(`Fehler beim Abrufen der Bilder für Baum ${treeId}:`, error)
      return []
    }
  }

  /**
   * Ruft einen Baum mit seinen Bildern ab
   * @param id ID des Baums
   * @returns Der Baum mit seinen Bildern
   */
  async getTreeWithPictures(id: string | number): Promise<TreeInfo> {
    const tree = await this.getTreeById(id)
    const pictures = await this.getTreePictures(id)
    return { ...tree, pictures }
  }
}

export default TreeInfoService
