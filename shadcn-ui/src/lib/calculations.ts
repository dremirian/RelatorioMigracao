import { Database, PricingConfig, MigrationConfig } from '../types/migration';
import { DEFAULT_DB_SIZE_GB, DBA_HOUR_COST_BRL, HOURS_PER_MONTH } from './migrationData';

export function parseTimeStr(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.match(/\d+/g);
  if (parts && parts.length === 2) {
    try {
      const h = parseInt(parts[0]);
      const m = parseInt(parts[1]);
      return h * 60 + m;
    } catch {
      return 0;
    }
  }
  return 0;
}

export function minutesToHHMM(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function parseDbLine(line: string): { name: string; sizeGb: number } | null {
  const trimmedLine = line.trim();
  if (!trimmedLine) return null;

  // Try to find GB pattern
  const gbMatch = trimmedLine.match(/(\d+)\s*GB/i);
  if (gbMatch) {
    const size = parseInt(gbMatch[1]);
    const name = trimmedLine.replace(/(\d+\s*GB)/i, '').trim().replace(/^[|:-]\s*/, '').replace(/\s*[|:-]\s*$/, '') || `DB_${size}GB`;
    return { name, sizeGb: size };
  }

  // Try other patterns like "name|size" or "name:size" or "name-size"
  const separatorMatch = trimmedLine.match(/^(.+?)[|:-]\s*(\d+)\s*$/);
  if (separatorMatch) {
    const name = separatorMatch[1].trim();
    const size = parseInt(separatorMatch[2]);
    return { name, sizeGb: size };
  }

  // Try pattern with number at the end
  const endNumberMatch = trimmedLine.match(/^(.+?)\s+(\d+)\s*$/);
  if (endNumberMatch) {
    const name = endNumberMatch[1].trim();
    const size = parseInt(endNumberMatch[2]);
    return { name, sizeGb: size };
  }

  // Default case - just the name
  return { name: trimmedLine, sizeGb: DEFAULT_DB_SIZE_GB };
}

export function recommendedVcores(sizeGb: number): number {
  if (sizeGb < 50) return 2;
  if (sizeGb < 200) return 4;
  if (sizeGb < 500) return 8;
  if (sizeGb < 2000) return 16;
  return 32;
}

export function migrationTimeEstimateHours(sizeGb: number): number {
  if (sizeGb < 50) return 5;
  if (sizeGb < 200) return 10;
  if (sizeGb < 500) return 20;
  if (sizeGb < 1000) return 32;
  const days = Math.ceil(sizeGb / 500);
  return days * 8 + 16;
}

export function calculateDatabaseCosts(
  databases: { name: string; sizeGb: number }[],
  config: MigrationConfig,
  pricing: PricingConfig
): Database[] {
  return databases.map((db, index) => {
    const vcores = recommendedVcores(db.sizeGb);
    const migrationHours = migrationTimeEstimateHours(db.sizeGb);
    const migrationCost = migrationHours * config.dbaHourCost;

    let monthlyCost = 0;
    switch (config.environment) {
      case 'IaaS': {
        const computeIaaS = vcores * pricing.iaasVcoreHour * HOURS_PER_MONTH;
        const storageIaaS = db.sizeGb * pricing.iaasStorageMonth;
        monthlyCost = computeIaaS + storageIaaS;
        break;
      }
      case 'PaaS': {
        const computePaaS = vcores * pricing.paasVcoreHour * HOURS_PER_MONTH * pricing.paasHaMultiplier;
        const storagePaaS = db.sizeGb * pricing.paasStorageMonth;
        monthlyCost = computePaaS + storagePaaS;
        break;
      }
      case 'SaaS': {
        monthlyCost = db.sizeGb * pricing.saasPerGb;
        break;
      }
      default: {
        // On-Premise
        const storageBrl = db.sizeGb * 0.04;
        const opsBrl = 10 * config.dbaHourCost;
        monthlyCost = storageBrl + opsBrl;
        break;
      }
    }

    return {
      id: `db-${index}`,
      name: db.name,
      sizeGb: db.sizeGb,
      vcores,
      migrationHours,
      migrationCost: Math.round(migrationCost * 100) / 100,
      monthlyCost: Math.round(monthlyCost * 100) / 100
    };
  });
}

export function parseCsvContent(csvContent: string): { name: string; sizeGb: number }[] {
  const lines = csvContent.split('\n').filter(line => line.trim());
  return lines.map(line => {
    const parts = line.split(',').map(part => part.trim());
    const name = parts[0] || 'Unnamed DB';
    const sizeGb = parts[1] ? parseInt(parts[1]) || DEFAULT_DB_SIZE_GB : DEFAULT_DB_SIZE_GB;
    return { name, sizeGb };
  });
}