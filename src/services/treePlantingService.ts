import { NocoDBService } from './nocodbService'
import type { PlantedTree } from '@/models/planted_tree'

/**
 * Service für den Zugriff auf die Planted_Trees Tabelle
 */
export class TreePlantingService {
  readonly nocoDBService: NocoDBService
  private readonly tableName = 'Planted_Trees'

  constructor(nocoDBService?: NocoDBService) {
    this.nocoDBService = nocoDBService || new NocoDBService()
    this.nocoDBService.registerTable(this.tableName, 'm7olw134y8mzyce')
  }

  /**
   * Pflanzt einen neuen Baum (oder mehrere), indem ein neuer Eintrag in der Planted_Trees Tabelle erstellt wird
   * @param treeData Daten des zu pflanzenden Baums
   * @returns Der neu gepflanzte Baum
   */
  async createTree(treeData: PlantedTree): Promise<PlantedTree | null> {
    const [newTree] = await this.nocoDBService.createRecords<PlantedTree, PlantedTree>(this.tableName, treeData)
    return newTree ?? null
  }
}
