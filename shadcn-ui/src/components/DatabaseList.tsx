import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database } from '../types/migration';
import { Upload, Eye } from 'lucide-react';

interface DatabaseListProps {
  databases: Database[];
  onImportCsv: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPreview: () => void;
}

export function DatabaseList({ databases, onImportCsv, onPreview }: DatabaseListProps) {
  const totalSize = databases.reduce((sum, db) => sum + db.sizeGb, 0);
  const totalMigrationCost = databases.reduce((sum, db) => sum + db.migrationCost, 0);
  const totalMonthlyCost = databases.reduce((sum, db) => sum + db.monthlyCost, 0);
  const totalMigrationHours = databases.reduce((sum, db) => sum + db.migrationHours, 0);

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7M4 7c0-2.21 1.79-4 4-4h8c2.21 0 4 1.79 4 4M4 7h16" />
              </svg>
            </div>
            Estimativas por Database
          </div>
          <div className="flex gap-2">
            <label className="cursor-pointer">
              <Button variant="secondary" size="sm" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Importar CSV
              </Button>
              <input
                type="file"
                accept=".csv"
                onChange={onImportCsv}
                className="hidden"
              />
            </label>
            <Button variant="secondary" size="sm" onClick={onPreview} className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {databases.length > 0 ? (
          <>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-2 text-left">#</th>
                    <th className="border p-2 text-left">Database</th>
                    <th className="border p-2 text-right">Tamanho (GB)</th>
                    <th className="border p-2 text-right">vCores</th>
                    <th className="border p-2 text-right">Tempo Migração (h)</th>
                    <th className="border p-2 text-right">Custo Migração (BRL)</th>
                    <th className="border p-2 text-right">Custo Mensal</th>
                  </tr>
                </thead>
                <tbody>
                  {databases.map((db, index) => (
                    <tr key={db.id} className="hover:bg-gray-50">
                      <td className="border p-2 text-center">{index + 1}</td>
                      <td className="border p-2 font-medium">{db.name}</td>
                      <td className="border p-2 text-right">{db.sizeGb}</td>
                      <td className="border p-2 text-right">{db.vcores}</td>
                      <td className="border p-2 text-right">{db.migrationHours}</td>
                      <td className="border p-2 text-right">R$ {db.migrationCost.toFixed(2)}</td>
                      <td className="border p-2 text-right">{db.monthlyCost.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="bg-blue-50 font-bold">
                    <td className="border p-2 text-center">-</td>
                    <td className="border p-2">TOTAL</td>
                    <td className="border p-2 text-right">{totalSize}</td>
                    <td className="border p-2 text-right">-</td>
                    <td className="border p-2 text-right">{totalMigrationHours}</td>
                    <td className="border p-2 text-right">R$ {totalMigrationCost.toFixed(2)}</td>
                    <td className="border p-2 text-right">{totalMonthlyCost.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">Total de Bancos</div>
                <div className="text-2xl font-bold">{databases.length}</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">Tamanho Total (GB)</div>
                <div className="text-2xl font-bold">{totalSize}</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">Custo Migração (BRL)</div>
                <div className="text-2xl font-bold">R$ {totalMigrationCost.toFixed(0)}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">Custo Mensal</div>
                <div className="text-2xl font-bold">{totalMonthlyCost.toFixed(0)}</div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7M4 7c0-2.21 1.79-4 4-4h8c2.21 0 4 1.79 4 4M4 7h16" />
              </svg>
            </div>
            <p>Nenhum banco de dados configurado</p>
            <p className="text-sm">Adicione bancos na seção "Listagem de Databases" acima</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}