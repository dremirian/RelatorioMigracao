import React, { useState, useEffect } from 'react';
import { MigrationForm } from '../components/MigrationForm';
import { ActivitiesTable } from '../components/ActivitiesTable';
import { DatabaseList } from '../components/DatabaseList';
import { PDFGenerator } from '../components/PDFGenerator';
import { MigrationConfig, PricingConfig, Activity, Database } from '../types/migration';
import { 
  DISK_MODEL, 
  DB_MODEL, 
  DEFAULT_PRICING, 
  DBA_HOUR_COST_BRL,
  ACTIVITIES_MODEL_ONPREM,
  ACTIVITIES_MODEL_IAAS,
  ACTIVITIES_MODEL_PAAS,
  ACTIVITIES_MODEL_SAAS
} from '../lib/migrationData';
import { parseDbLine, calculateDatabaseCosts, parseCsvContent } from '../lib/calculations';
import { toast } from 'sonner';

export default function Index() {
  const [config, setConfig] = useState<MigrationConfig>({
    clientName: 'Cliente',
    osVersion: 'Windows Server 2019 Datacenter',
    sqlVersion: 'Microsoft SQL Server 2019',
    environment: 'On-Premise',
    diskSegregation: '',
    collation: '',
    memory: 'Mínimo 32GB / Ideal: 64GB',
    cpu: 'Mínimo 4 / Ideal: 8',
    dbaHourCost: DBA_HOUR_COST_BRL
  });

  const [pricing, setPricing] = useState<PricingConfig>({
    iaasVcoreHour: DEFAULT_PRICING.iaas.vcoreHourUsd,
    iaasStorageMonth: DEFAULT_PRICING.iaas.storageGbMonthUsd,
    paasVcoreHour: DEFAULT_PRICING.paas.vcoreHourUsd,
    paasStorageMonth: DEFAULT_PRICING.paas.storageGbMonthUsd,
    paasHaMultiplier: DEFAULT_PRICING.paas.haMultiplier,
    saasPerGb: DEFAULT_PRICING.saas.perGbMonthUsd
  });

  const [diskSegregation, setDiskSegregation] = useState(DISK_MODEL.join('\n'));
  const [databaseList, setDatabaseList] = useState(DB_MODEL.join('\n'));
  const [activities, setActivities] = useState<Activity[]>([]);
  const [databases, setDatabases] = useState<Database[]>([]);

  // Initialize activities based on environment
  useEffect(() => {
    let activityModels;
    switch (config.environment) {
      case 'IaaS':
        activityModels = ACTIVITIES_MODEL_IAAS;
        break;
      case 'PaaS':
        activityModels = ACTIVITIES_MODEL_PAAS;
        break;
      case 'SaaS':
        activityModels = ACTIVITIES_MODEL_SAAS;
        break;
      default:
        activityModels = ACTIVITIES_MODEL_ONPREM;
    }

    const activitiesWithIds = activityModels.map((activity, index) => ({
      ...activity,
      id: `activity-${config.environment}-${index}`,
      team: activity.team.replace('Cliente', config.clientName)
    }));

    setActivities(activitiesWithIds);
  }, [config.environment, config.clientName]);

  // Calculate databases when database list or config changes
  useEffect(() => {
    const lines = databaseList.split('\n').filter(line => line.trim());
    const parsedDatabases = lines
      .map(parseDbLine)
      .filter(db => db !== null)
      .map(db => db!);

    const calculatedDatabases = calculateDatabaseCosts(parsedDatabases, config, pricing);
    setDatabases(calculatedDatabases);
  }, [databaseList, config, pricing]);

  const handleImportCsv = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvContent = e.target?.result as string;
        const parsedDatabases = parseCsvContent(csvContent);
        const dbLines = parsedDatabases.map(db => `${db.name} - ${db.sizeGb}GB`);
        setDatabaseList(dbLines.join('\n'));
        toast.success('CSV importado com sucesso!');
      } catch (error) {
        toast.error('Erro ao importar CSV');
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    event.target.value = '';
  };

  const handlePreview = () => {
    if (databases.length === 0) {
      toast.info('Nenhum banco configurado');
      return;
    }

    const totalMonthlyCost = databases.reduce((sum, db) => sum + db.monthlyCost, 0);
    const totalMigrationCost = databases.reduce((sum, db) => sum + db.migrationCost, 0);
    
    const summary = `
Resumo das Estimativas:
• Total de bancos: ${databases.length}
• Tamanho total: ${databases.reduce((sum, db) => sum + db.sizeGb, 0)} GB
• Custo total de migração: R$ ${totalMigrationCost.toFixed(2)}
• Custo mensal (${config.environment}): ${totalMonthlyCost.toFixed(2)}
    `.trim();

    toast.info(summary, { duration: 5000 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="/assets/logo.png" 
                alt="Logo" 
                className="h-12 w-auto"
                onError={(e) => {
                  // Fallback if logo doesn't load
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Estimador de Migração SQL Server
                </h1>
                <p className="text-gray-600 mt-1">Ferramenta profissional para estimativa de projetos de migração</p>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Ambiente: {config.environment}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Configuration Form */}
          <MigrationForm
            config={config}
            pricing={pricing}
            diskSegregation={diskSegregation}
            databaseList={databaseList}
            onConfigChange={setConfig}
            onPricingChange={setPricing}
            onDiskSegregationChange={setDiskSegregation}
            onDatabaseListChange={setDatabaseList}
          />

          {/* Database Estimates */}
          <DatabaseList
            databases={databases}
            onImportCsv={handleImportCsv}
            onPreview={handlePreview}
          />

          {/* Activities Table */}
          <ActivitiesTable
            activities={activities}
            onActivitiesChange={setActivities}
          />

          {/* PDF Generation */}
          <div className="flex justify-center py-8">
            <PDFGenerator
              config={config}
              databases={databases}
              activities={activities}
              diskSegregation={diskSegregation}
              databaseList={databaseList}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p>© 2025 DBAOnline - Ferramenta de Estimativa de Migração SQL Server</p>
            <p className="text-sm mt-1">Desenvolvido para facilitar o planejamento de projetos de migração</p>
          </div>
        </div>
      </footer>
    </div>
  );
}