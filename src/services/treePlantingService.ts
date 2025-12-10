import { NocoDBService } from './nocodbService'
import type { PlantedTree } from '@/models/planted_tree'

/**
 * Service für den Zugriff auf die Planted_Trees Tabelle
 */
export class TreePlantingService {
  readonly nocoDBService: NocoDBService
  private readonly tableName = 'Planted_Trees'

  // Link-Feld-IDs aus der NocoDB-Konfiguration
  private readonly userLinkFieldId = 'cjuyqc9lsmd6gtt'
  private readonly locationLinkFieldId = 'c2tnwub1dvlniya'
  private readonly treeInfoLinkFieldId = 'cowtx44w8kcieoy'

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

  /**
   * Verknüpft einen Benutzer mit einem gepflanzten Baum
   * @param treePlantedId ID des gepflanzten Baums
   * @param userId ID des Benutzers
   */
  async linkUser(treePlantedId: string | number, userId: string | number): Promise<boolean> {
    return await this.nocoDBService.linkRecords(
      this.tableName,
      this.userLinkFieldId,
      treePlantedId,
      [{ id: userId }]
    )
  }

  /**
   * Verknüpft einen Standort mit einem gepflanzten Baum
   * @param treePlantedId ID des gepflanzten Baums
   * @param locationId ID des Standorts
   */
  async linkLocation(treePlantedId: string | number, locationId: string | number): Promise<boolean> {
    return await this.nocoDBService.linkRecords(
      this.tableName,
      this.locationLinkFieldId,
      treePlantedId,
      [{ id: locationId }]
    )
  }

  /**
   * Verknüpft eine Baumart mit einem gepflanzten Baum
   * @param treePlantedId ID des gepflanzten Baums
   * @param treeInfoId ID der Baumart (TreeInfo)
   */
  async linkTreeInfo(treePlantedId: string | number, treeInfoId: string | number): Promise<boolean> {
    return await this.nocoDBService.linkRecords(
      this.tableName,
      this.treeInfoLinkFieldId,
      treePlantedId,
      [{ id: treeInfoId }]
    )
  }
}
