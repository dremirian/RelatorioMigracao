export interface Database {
  id: string;
  name: string;
  sizeGb: number;
  vcores: number;
  migrationHours: number;
  migrationCost: number;
  monthlyCost: number;
}

export interface Activity {
  id: string;
  description: string;
  team: string;
  status: string;
  timeEstimate: string;
}

export interface MigrationConfig {
  clientName: string;
  osVersion: string;
  sqlVersion: string;
  environment: 'On-Premise' | 'IaaS' | 'PaaS' | 'SaaS';
  diskSegregation: string;
  collation: string;
  memory: string;
  cpu: string;
  dbaHourCost: number;
}

export interface PricingConfig {
  iaasVcoreHour: number;
  iaasStorageMonth: number;
  paasVcoreHour: number;
  paasStorageMonth: number;
  paasHaMultiplier: number;
  saasPerGb: number;
}

export interface EstimatesSummary {
  totalDatabases: number;
  totalSizeGb: number;
  totalMigrationHours: number;
  totalMigrationCost: number;
  totalMonthlyCost: number;
  totalActivityHours: string;
}