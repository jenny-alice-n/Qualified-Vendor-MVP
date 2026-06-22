export interface BusinessType {
  businessTypeCode: string;
  businessTypeDesc: string;
}

export interface NaicsItem {
  naicsCode: string;
  naicsDescription: string;
  sbaSmallBusiness?: string;
  naicsException?: string | null;
}

export interface EntityRegistration {
  ueiSAM: string;
  entityEFTIndicator?: string;
  cageCode: string;
  legalBusinessName: string;
  dbaName?: string;
  purposeOfRegistrationCode?: string;
  purposeOfRegistrationDesc?: string | null;
  registrationStatus: string;
  registrationDate?: string;
  lastUpdateDate?: string;
  registrationExpirationDate?: string;
  activationDate?: string;
}

export interface PhysicalAddress {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  stateOrProvinceCode?: string;
  zipCode?: string;
  zipCodePlus4?: string;
  countryCode?: string;
}

export interface CoreData {
  entityInformation?: {
    entityURL?: string;
    entityDivisionName?: string | null;
    entityDivisionNumber?: string | null;
    entityStartDate?: string | null;
    fiscalYearEndCloseDate?: string | null;
    submissionDate?: string | null;
  };
  physicalAddress?: PhysicalAddress;
  mailingAddress?: PhysicalAddress;
  congressionalDistrict?: string;
  generalInformation?: {
    entityStructureCode?: string;
    entityStructureDesc?: string;
  };
  businessTypes?: {
    businessTypeList?: BusinessType[];
    sbaBusinessTypeList?: any[];
  };
}

export interface VendorSummaryInfo {
  vendorSummary?: string;
  coreCapabilities?: string[] | null;
  similarityScore?: number;
  summarySource?: string | null;
  vendorSearchSource?: string;
  awardCapabilities?: string[];
}

export interface Justification {
  overallScore: number;
  pastPerformance?: number;
  technicalCapability?: number;
  naicsSetAsideFit?: number;
  agencyRelationship?: number;
  justification: string;
}

export interface Vendor {
  entityRegistration: EntityRegistration;
  coreData: CoreData;
  assertions?: {
    goodsAndServices?: {
      naicsList?: NaicsItem[];
      pscList?: any[];
    };
  };
  vendorSummaryInfo?: VendorSummaryInfo;
  gsaSources?: string[];
  justification?: Justification;
}

export interface SearchResponse {
  totalRecords: number;
  entityData: Vendor[];
}

export interface SavedConnectionSettings {
  endpointUrl: string;
  apiKey: string;
  apiKeyHeaderName: string;
  batchSize: number;
  startIndex: number;
  vendorSource: string;
  generateJustification: boolean;
  useLiveApi: boolean;
  bypassBackendProxy?: boolean;
}
