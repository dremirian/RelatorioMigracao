import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity } from '../types/migration';
import { parseTimeStr, minutesToHHMM } from '../lib/calculations';
import { Plus, Trash2, Copy, Clock } from 'lucide-react';

interface ActivitiesTableProps {
  activities: Activity[];
  onActivitiesChange: (activities: Activity[]) => void;
}

export function ActivitiesTable({ activities, onActivitiesChange }: ActivitiesTableProps) {
  const handleActivityChange = (id: string, field: keyof Activity, value: string) => {
    const updatedActivities = activities.map(activity =>
      activity.id === id ? { ...activity, [field]: value } : activity
    );
    onActivitiesChange(updatedActivities);
  };

  const addActivity = () => {
    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      description: 'Nova atividade de migração',
      team: 'DBAOnline',
      status: 'Pendente',
      timeEstimate: '00:30'
    };
    onActivitiesChange([...activities, newActivity]);
  };

  const duplicateActivity = (activity: Activity) => {
    const duplicatedActivity: Activity = {
      ...activity,
      id: `activity-${Date.now()}`,
      description: `${activity.description} (cópia)`
    };
    onActivitiesChange([...activities, duplicatedActivity]);
  };

  const removeActivity = (id: string) => {
    const updatedActivities = activities.filter(activity => activity.id !== id);
    onActivitiesChange(updatedActivities);
  };

  const moveActivity = (index: number, direction: 'up' | 'down') => {
    const newActivities = [...activities];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < activities.length) {
      [newActivities[index], newActivities[targetIndex]] = [newActivities[targetIndex], newActivities[index]];
      onActivitiesChange(newActivities);
    }
  };

  const totalMinutes = activities.reduce((total, activity) => {
    return total + parseTimeStr(activity.timeEstimate);
  }, 0);

  const totalHours = minutesToHHMM(totalMinutes);
  const totalActivities = activities.length;
  const completedActivities = activities.filter(a => a.status.toLowerCase().includes('concluído') || a.status.toLowerCase().includes('finalizado')).length;

  const statusOptions = [
    'Pendente',
    'Em Andamento', 
    'Concluído',
    'Cancelado',
    'Em Revisão',
    'Aguardando Cliente'
  ];

  const teamOptions = [
    'DBAOnline',
    'Cliente',
    'Infra',
    'Infra/Cliente',
    'Infra/DBA',
    'DBAOnline/Cliente',
    'Cliente/DBA',
    'Cliente/QA',
    'N/A'
  ];

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            Atividades de Migração
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {totalHours}
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full">
              {completedActivities}/{totalActivities} concluídas
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6 flex flex-wrap gap-2">
          <Button onClick={addActivity} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4" />
            Nova Atividade
          </Button>
          <div className="text-sm text-gray-600 flex items-center gap-4 ml-4">
            <span>💡 Dica: Você pode reordenar, duplicar ou excluir atividades conforme necessário</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Header */}
            <div className="grid grid-cols-12 gap-2 mb-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg font-semibold text-sm border">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-4">Descrição da Atividade</div>
              <div className="col-span-2">Equipe Responsável</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Tempo</div>
              <div className="col-span-2 text-center">Ações</div>
            </div>
            
            {/* Activities */}
            <div className="space-y-2">
              {activities.map((activity, index) => (
                <div key={activity.id} className="grid grid-cols-12 gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className="col-span-1 flex items-center justify-center">
                    <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-semibold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="col-span-4">
                    <Input
                      value={activity.description}
                      onChange={(e) => handleActivityChange(activity.id, 'description', e.target.value)}
                      className="text-sm border-gray-200 focus:border-blue-400"
                      placeholder="Descreva a atividade..."
                    />
                  </div>
                  <div className="col-span-2">
                    <Select value={activity.team} onValueChange={(value) => handleActivityChange(activity.id, 'team', value)}>
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {teamOptions.map(team => (
                          <SelectItem key={team} value={team}>{team}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Select value={activity.status} onValueChange={(value) => handleActivityChange(activity.id, 'status', value)}>
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1">
                    <Input
                      value={activity.timeEstimate}
                      onChange={(e) => handleActivityChange(activity.id, 'timeEstimate', e.target.value)}
                      className="text-sm text-center"
                      placeholder="00:30"
                    />
                  </div>
                  <div className="col-span-2 flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveActivity(index, 'up')}
                      disabled={index === 0}
                      className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 p-1"
                      title="Mover para cima"
                    >
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveActivity(index, 'down')}
                      disabled={index === activities.length - 1}
                      className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 p-1"
                      title="Mover para baixo"
                    >
                      ↓
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => duplicateActivity(activity)}
                      className="text-gray-500 hover:text-green-600 hover:bg-green-50 p-1"
                      title="Duplicar atividade"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeActivity(activity.id)}
                      className="text-gray-500 hover:text-red-600 hover:bg-red-50 p-1"
                      title="Excluir atividade"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {activities.length === 0 && (
          <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-lg font-medium mb-2">Nenhuma atividade adicionada</p>
            <p className="text-sm mb-4">Clique em "Nova Atividade" para começar a planejar sua migração</p>
            <Button onClick={addActivity} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeira Atividade
            </Button>
          </div>
        )}

        {/* Summary Footer */}
        {activities.length > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{totalActivities}</div>
                <div className="text-sm text-gray-600">Total de Atividades</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{totalHours}</div>
                <div className="text-sm text-gray-600">Tempo Total Estimado</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{Math.round((completedActivities / totalActivities) * 100)}%</div>
                <div className="text-sm text-gray-600">Progresso</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}