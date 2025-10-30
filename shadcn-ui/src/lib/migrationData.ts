import { Activity } from '../types/migration';

export const DISK_MODEL = [
  "(C:) S.O com 50 GB",
  "(B:) Backup com 35 GB", 
  "(D:) Data com 20 GB",
  "(L:) LOG com 10 GB",
  "(T:) TEMPDB com 7 GB",
  "(E:) BINÁRIOS SQL 50GB"
];

export const DB_MODEL = [
  "FIXA_DbFilial",
  "FIXA_Empresa"
];

export const ACTIVITIES_MODEL_ONPREM: Omit<Activity, 'id'>[] = [
  { description: "Check do novo servidor / storage / permissões login da DBA / drives de instalação", team: "DBAOnline", status: "Pendente", timeEstimate: "01:00" },
  { description: "Disponibilização da ISO de instalação SQL Server e ODBC (precisa estar no servidor)", team: "Cliente", status: "Pendente", timeEstimate: "" },
  { description: "Instalação SQL Server", team: "DBAOnline", status: "Pendente", timeEstimate: "01:00" },
  { description: "Aplicação de Path SQL Server", team: "DBAOnline", status: "Pendente", timeEstimate: "01:00" },
  { description: "Cópia dos arquivos de backup do servidor de origem para efetuarmos restore no novo servidor (backup restore/log shipping ou AG)", team: "Cliente", status: "Pendente", timeEstimate: "" },
  { description: "Migração/checagem de jobs", team: "DBAOnline", status: "Pendente", timeEstimate: "00:30" },
  { description: "Migração triggers", team: "N/A", status: "N/A", timeEstimate: "00:15" },
  { description: "Migração linked servers", team: "N/A", status: "N/A", timeEstimate: "00:15" },
  { description: "Migração de Server logins", team: "DBAOnline", status: "Pendente", timeEstimate: "00:15" },
  { description: "Configuração do Database Mail", team: "N/A", status: "N/A", timeEstimate: "00:15" },
  { description: "Ajuste de Memória", team: "DBAOnline", status: "Pendente", timeEstimate: "00:15" },
  { description: "Ajuste de CPU", team: "DBAOnline", status: "Pendente", timeEstimate: "00:15" },
  { description: "Configuração Lock Pages in Memory", team: "DBAOnline", status: "Pendente", timeEstimate: "00:15" },
  { description: "Configuração de Instant File Initialization (IFI)", team: "DBAOnline", status: "Pendente", timeEstimate: "00:15" },
  { description: "Conexão de Administrador Dedicada (DAC)", team: "DBAOnline", status: "Pendente", timeEstimate: "00:15" },
  { description: "Ajuste de FileGrowth", team: "DBAOnline", status: "Pendente", timeEstimate: "00:30" },
  { description: "Ajustes no Temporary Database (tempdb)", team: "DBAOnline", status: "Pendente", timeEstimate: "00:15" },
  { description: "Ajuste Cost Threshold Parallelism", team: "DBAOnline", status: "Pendente", timeEstimate: "00:15" },
  { description: "Ajuste Max Degree of Parallelism", team: "DBAOnline", status: "Pendente", timeEstimate: "00:15" },
  { description: "Ajustes/Testes Backup", team: "DBAOnline", status: "Pendente", timeEstimate: "00:30" },
  { description: "Liberação para homologação/testes finais", team: "Cliente", status: "Pendente", timeEstimate: "" }
];

export const ACTIVITIES_MODEL_IAAS: Omit<Activity, 'id'>[] = [
  { description: "Criar VM no provedor (tamanho, imagem, availability set/zone)", team: "Infra/Cliente", status: "Pendente", timeEstimate: "00:30" },
  { description: "Provisionar discos gerenciados (OS/Data/Log/TempDB/Backup)", team: "Infra/Cliente", status: "Pendente", timeEstimate: "00:30" },
  { description: "Configurar rede: NSG, sub-net, IP público (se necessário), regras firewall", team: "Infra/Cliente", status: "Pendente", timeEstimate: "00:30" },
  { description: "Configurar storage account / performance (IOPS/throughput) e attach disks", team: "Infra/Cliente", status: "Pendente", timeEstimate: "00:30" },
  { description: "Domain join / configurar contas de serviço / roles", team: "Infra/DBA", status: "Pendente", timeEstimate: "00:30" },
  { description: "Aplicar updates Windows e reboot (se aplicável)", team: "Infra/DBA", status: "Pendente", timeEstimate: "01:00" },
  { description: "Configurar monitoring agent (ex.: Log Analytics / CloudWatch Agent)", team: "Infra/DBA", status: "Pendente", timeEstimate: "00:30" },
  { description: "Instalar SQL Server (ISO / configuration) e .NET/ODBC necessários", team: "DBAOnline", status: "Pendente", timeEstimate: "01:00" },
  { description: "Habilitar IFI e ajustar privilégios", team: "DBAOnline", status: "Pendente", timeEstimate: "00:15" },
  { description: "Configurar Lock Pages in Memory (se necessário)", team: "DBAOnline", status: "Pendente", timeEstimate: "00:15" },
  { description: "Configurar TempDB e Files", team: "DBAOnline", status: "Pendente", timeEstimate: "00:30" },
  { description: "Configurar autogrowth e filegrowth (MB)", team: "DBAOnline", status: "Pendente", timeEstimate: "00:15" },
  { description: "Configurar backups (agent/snapshots) e retention", team: "DBAOnline/Infra", status: "Pendente", timeEstimate: "00:30" },
  { description: "Restore inicial e validação", team: "Cliente/DBAOnline", status: "Pendente", timeEstimate: "" },
  { description: "Cutover e troca de connection strings/DNS", team: "DBAOnline/Cliente", status: "Pendente", timeEstimate: "00:30" },
  { description: "Monitoramento pós-cutover (48h)", team: "DBAOnline/Cliente", status: "Pendente", timeEstimate: "08:00" },
  { description: "Documentação e handover", team: "DBAOnline", status: "Pendente", timeEstimate: "01:00" }
];

export const ACTIVITIES_MODEL_PAAS: Omit<Activity, 'id'>[] = [
  { description: "Escolher tier e region (vCore/DTU/Hyperscale)", team: "DBAOnline/Cliente", status: "Pendente", timeEstimate: "00:30" },
  { description: "Configurar VNet Integration / Private Endpoint", team: "Infra/Cliente", status: "Pendente", timeEstimate: "00:30" },
  { description: "Configurar firewall do servidor PaaS e rules", team: "DBAOnline/Cliente", status: "Pendente", timeEstimate: "00:15" },
  { description: "Configurar retention/backup point-in-time", team: "DBAOnline", status: "Pendente", timeEstimate: "00:15" },
  { description: "Provisionar replicas (geo/zone) se aplicável", team: "DBAOnline", status: "Pendente", timeEstimate: "00:30" },
  { description: "Calcular sizing (vCores/storage) e ajustar parameters", team: "DBAOnline", status: "Pendente", timeEstimate: "00:30" },
  { description: "Migrar dados via DMS / Data Migration Service (online)", team: "DBAOnline/Cliente", status: "Pendente", timeEstimate: "" },
  { description: "Ajustes de compatibilidade e configurações de DB (autogrowth/tablespaces)", team: "DBAOnline", status: "Pendente", timeEstimate: "00:30" },
  { description: "Testes funcionais e performance (smoke + stress)", team: "Cliente/QA/DBA", status: "Pendente", timeEstimate: "02:00" },
  { description: "Cutover: swap endpoints / private endpoint / DNS", team: "DBAOnline/Cliente", status: "Pendente", timeEstimate: "00:30" },
  { description: "Monitoramento pós-cutover e ajustes de tiers", team: "DBAOnline/Cliente", status: "Pendente", timeEstimate: "08:00" },
  { description: "Documentação e handover (runbook específico PaaS)", team: "DBAOnline", status: "Pendente", timeEstimate: "01:00" }
];

export const ACTIVITIES_MODEL_SAAS: Omit<Activity, 'id'>[] = [
  { description: "Verificar compatibilidade funcional com SaaS (endpoints, features)", team: "Cliente/DBA", status: "Pendente", timeEstimate: "01:00" },
  { description: "Exportar dados / ETL para o provedor SaaS (formato exigido)", team: "Cliente/DBA", status: "Pendente", timeEstimate: "" },
  { description: "Importar dados no SaaS e mapear usuários/perfis", team: "Cliente/Proveedor", status: "Pendente", timeEstimate: "02:00" },
  { description: "Validação e testes com o SaaS (funcional)", team: "Cliente/QA", status: "Pendente", timeEstimate: "02:00" },
  { description: "Treinamento e handover para operação no SaaS", team: "Fornecedor/Cliente", status: "Pendente", timeEstimate: "01:00" }
];

export const DEFAULT_PRICING = {
  iaas: { vcoreHourUsd: 0.03, storageGbMonthUsd: 0.03 },
  paas: { vcoreHourUsd: 0.05, storageGbMonthUsd: 0.10, haMultiplier: 1.6 },
  saas: { perGbMonthUsd: 0.25 }
};

export const DEFAULT_DB_SIZE_GB = 50;
export const DBA_HOUR_COST_BRL = 200.0;
export const HOURS_PER_DAY = 8;
export const HOURS_PER_MONTH = 730;