import type { Picture } from "./picture";

/**
 * Interface für die Daten in der User Tabelle
 */
export interface UserInfo {
  id: string | number;
  username: string;
  email: string;
  password: string;
  treesPlanted?: number;
  moneyDonated?: number;
  signUpDate?: string;
  logedInLast?: string;
  profilePicture?: Picture[];
}
