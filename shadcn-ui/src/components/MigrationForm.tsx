import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MigrationConfig, PricingConfig } from '../types/migration';
import { DISK_MODEL, DB_MODEL } from '../lib/migrationData';

interface MigrationFormProps {
  config: MigrationConfig;
  pricing: PricingConfig;
  diskSegregation: string;
  databaseList: string;
  onConfigChange: (config: MigrationConfig) => void;
  onPricingChange: (pricing: PricingConfig) => void;
  onDiskSegregationChange: (value: string) => void;
  onDatabaseListChange: (value: string) => void;
}

export function MigrationForm({
  config,
  pricing,
  diskSegregation,
  databaseList,
  onConfigChange,
  onPricingChange,
  onDiskSegregationChange,
  onDatabaseListChange
}: MigrationFormProps) {
  const handleConfigChange = (field: keyof MigrationConfig, value: string | number) => {
    onConfigChange({ ...config, [field]: value });
  };

  const handlePricingChange = (field: keyof PricingConfig, value: number) => {
    onPricingChange({ ...pricing, [field]: value });
  };

  const getEnvironmentDefaults = (environment: string) => {
    switch (environment) {
      case 'PaaS':
        return {
          memory: 'Mínimo 16GB / Ideal: 32GB',
          cpu: 'Mínimo 4 / Ideal: 8'
        };
      case 'IaaS':
        return {
          memory: 'Mínimo 32GB / Ideal: 64GB',
          cpu: 'Mínimo 4 / Ideal: 8'
        };
      case 'SaaS':
        return {
          memory: 'Gerenciado pelo provedor (SaaS)',
          cpu: 'Gerenciado pelo provedor (SaaS)'
        };
      default:
        return {
          memory: 'Mínimo 32GB / Ideal: 64GB',
          cpu: 'Mínimo 4 / Ideal: 8'
        };
    }
  };

  const handleEnvironmentChange = (environment: string) => {
    const defaults = getEnvironmentDefaults(environment);
    onConfigChange({
      ...config,
      environment: environment as MigrationConfig['environment'],
      memory: defaults.memory,
      cpu: defaults.cpu
    });
  };

  return (
    <div className="space-y-6">
      {/* Configuração Principal */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            Configuração do Projeto
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientName">Nome do Cliente</Label>
              <Input
                id="clientName"
                value={config.clientName}
                onChange={(e) => handleConfigChange('clientName', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="environment">Tipo de Ambiente</Label>
              <Select value={config.environment} onValueChange={handleEnvironmentChange}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="On-Premise">On-Premise</SelectItem>
                  <SelectItem value="IaaS">IaaS</SelectItem>
                  <SelectItem value="PaaS">PaaS</SelectItem>
                  <SelectItem value="SaaS">SaaS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="osVersion">Versão do S.O</Label>
              <Input
                id="osVersion"
                value={config.osVersion}
                onChange={(e) => handleConfigChange('osVersion', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="sqlVersion">Versão do SQL</Label>
              <Input
                id="sqlVersion"
                value={config.sqlVersion}
                onChange={(e) => handleConfigChange('sqlVersion', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="memory">Memória da Instância</Label>
              <Input
                id="memory"
                value={config.memory}
                onChange={(e) => handleConfigChange('memory', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cpu">Processadores da Instância</Label>
              <Input
                id="cpu"
                value={config.cpu}
                onChange={(e) => handleConfigChange('cpu', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="collation">Collation da Instância</Label>
              <Input
                id="collation"
                value={config.collation}
                onChange={(e) => handleConfigChange('collation', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="dbaHourCost">Custo/hora DBA (BRL)</Label>
              <Input
                id="dbaHourCost"
                type="number"
                value={config.dbaHourCost}
                onChange={(e) => handleConfigChange('dbaHourCost', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Segregação de Discos */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
          <CardTitle>Segregação dos Discos</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Textarea
            value={diskSegregation}
            onChange={(e) => onDiskSegregationChange(e.target.value)}
            rows={6}
            className="w-full"
            placeholder="Descreva a segregação dos discos..."
          />
        </CardContent>
      </Card>

      {/* Lista de Databases */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
          <CardTitle>Listagem de Databases</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-2">
            <Label className="text-sm text-gray-600">
              Formato: 'DBName - 180GB' ou 'DBName|180' ou 'DBName' (50GB default)
            </Label>
          </div>
          <Textarea
            value={databaseList}
            onChange={(e) => onDatabaseListChange(e.target.value)}
            rows={5}
            className="w-full"
            placeholder="Liste os bancos de dados..."
          />
        </CardContent>
      </Card>

      {/* Configuração de Preços */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
          <CardTitle>Preços (ajuste para estimativas mensais)</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="iaasVcore">IaaS vCore $/h</Label>
              <Input
                id="iaasVcore"
                type="number"
                step="0.001"
                value={pricing.iaasVcoreHour}
                onChange={(e) => handlePricingChange('iaasVcoreHour', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="iaasStorage">IaaS storage $/GB/mês</Label>
              <Input
                id="iaasStorage"
                type="number"
                step="0.001"
                value={pricing.iaasStorageMonth}
                onChange={(e) => handlePricingChange('iaasStorageMonth', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="paasVcore">PaaS vCore $/h</Label>
              <Input
                id="paasVcore"
                type="number"
                step="0.001"
                value={pricing.paasVcoreHour}
                onChange={(e) => handlePricingChange('paasVcoreHour', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="paasStorage">PaaS storage $/GB/mês</Label>
              <Input
                id="paasStorage"
                type="number"
                step="0.001"
                value={pricing.paasStorageMonth}
                onChange={(e) => handlePricingChange('paasStorageMonth', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="paasHa">PaaS HA multiplier</Label>
              <Input
                id="paasHa"
                type="number"
                step="0.1"
                value={pricing.paasHaMultiplier}
                onChange={(e) => handlePricingChange('paasHaMultiplier', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="saasPerGb">SaaS $/GB/mês</Label>
              <Input
                id="saasPerGb"
                type="number"
                step="0.001"
                value={pricing.saasPerGb}
                onChange={(e) => handlePricingChange('saasPerGb', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}