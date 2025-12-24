
export interface PincodeData {
  pincode: string;
  officeName: string;
  officeType: string;
  deliveryStatus: string;
  divisionName: string;
  regionName: string;
  circleName: string;
  district: string;
  state: string;
  block: string;
}

export interface LocalityInsight {
  summary: string;
  keyPlaces: string[];
  connectivity: string;
  popularFor: string[];
  hospitals: string[];
  schools: string[];
}

export type SearchMode = 'smart';
export type AppView = 'home' | 'directory' | 'detail' | 'privacy' | 'terms' | 'about' | 'guidelines' | 'referral';

export interface AISearchResult {
  query: string;
  detectedType: 'pincode' | 'area';
  explanation: string;
}
