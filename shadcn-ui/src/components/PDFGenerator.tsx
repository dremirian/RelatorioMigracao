import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { MigrationConfig, Database, Activity } from '../types/migration';
import { parseTimeStr, minutesToHHMM } from '../lib/calculations';

interface PDFGeneratorProps {
  config: MigrationConfig;
  databases: Database[];
  activities: Activity[];
  diskSegregation: string;
  databaseList: string;
}

export function PDFGenerator({
  config,
  databases,
  activities,
  diskSegregation,
  databaseList,
}: PDFGeneratorProps) {
  const generatePDF = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    let yPosition = margin;

    // Colors
    const primaryBlue = [70, 129, 189];
    const lightBlue = [217, 225, 242];
    const darkBlue = [31, 73, 125];
    const green = [76, 175, 80];
    const orange = [255, 152, 0];
    const purple = [156, 39, 176];

    // Helper function to add colored rectangle
    const addColoredRect = (
      x: number,
      y: number,
      width: number,
      height: number,
      color: number[]
    ) => {
      doc.setFillColor(color[0], color[1], color[2]);
      doc.rect(x, y, width, height, 'F');
    };

    // Helper function to add text with word wrap
    const addText = (
      text: string,
      x: number,
      y: number,
      maxWidth?: number,
      fontSize = 10,
      color: number[] = [0, 0, 0]
    ) => {
      doc.setFontSize(fontSize);
      doc.setTextColor(color[0], color[1], color[2]);
      if (maxWidth) {
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, y);
        return y + lines.length * fontSize * 0.4;
      } else {
        doc.text(text, x, y);
        return y + fontSize * 0.4;
      }
    };

    // Header
    addColoredRect(0, 0, pageWidth, 40, primaryBlue);

    // Logo
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise((resolve) => {
        img.onload = () => {
          try {
            doc.addImage(img, 'PNG', margin, 8, 24, 24, undefined, 'FAST');
          } catch (error) {
            console.log('Logo loading failed, continuing without logo');
          }
          resolve(true);
        };
        img.onerror = () => {
          console.log('Logo not found, continuing without logo');
          resolve(false);
        };
        img.src = '/assets/logo.png';

        setTimeout(() => resolve(false), 2000);
      });
    } catch (error) {
      console.log('Logo error:', error);
    }

    // Título
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('RELATÓRIO DE MIGRAÇÃO', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(`Cliente: ${config.clientName}`, pageWidth / 2, 30, {
      align: 'center',
    });

    yPosition = 50;

    // Configuração do servidor
    addColoredRect(margin, yPosition, pageWidth - 2 * margin, 8, primaryBlue);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('CONFIGURAÇÃO DO SERVIDOR', margin + 5, yPosition + 6);
    yPosition += 15;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    const configData = [
      ['Nome do Cliente:', config.clientName],
      ['Versão do S.O:', config.osVersion],
      ['Versão do SQL:', config.sqlVersion],
      ['Tipo de Ambiente:', config.environment],
      ['Collation da Instância:', config.collation],
      ['Memória da Instância:', config.memory],
      ['Processadores da Instância:', config.cpu],
    ];

    configData.forEach(([label, value], index) => {
      if (index % 2 === 0) {
        addColoredRect(
          margin,
          yPosition - 2,
          pageWidth - 2 * margin,
          8,
          lightBlue
        );
      }
      doc.setFont('helvetica', 'bold');
      doc.text(label, margin + 5, yPosition + 3);
      doc.setFont('helvetica', 'normal');
      doc.text(value, margin + 70, yPosition + 3);
      yPosition += 8;
    });

    yPosition += 10;

    // Segregação dos discos
    addColoredRect(margin, yPosition, pageWidth - 2 * margin, 8, green);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('SEGREGAÇÃO DOS DISCOS', margin + 5, yPosition + 6);
    yPosition += 15;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    yPosition = addText(
      diskSegregation,
      margin + 5,
      yPosition,
      pageWidth - 2 * margin - 10,
      9
    );
    yPosition += 10;

    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = margin;
    }

    // Estimativas por database
    addColoredRect(margin, yPosition, pageWidth - 2 * margin, 8, orange);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('ESTIMATIVAS POR DATABASE', margin + 5, yPosition + 6);
    yPosition += 15;

    if (databases.length > 0) {
      addColoredRect(margin, yPosition - 2, pageWidth - 2 * margin, 10, darkBlue);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);

      const headers = ['#', 'Database', 'Tamanho (GB)'];
      const colWidths = [15, 80, 30];
      let xPos = margin + 2;

      headers.forEach((header, i) => {
        doc.text(header, xPos, yPosition + 5);
        xPos += colWidths[i];
      });
      yPosition += 12;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);

      databases.forEach((db, index) => {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = margin;

          addColoredRect(
            margin,
            yPosition - 2,
            pageWidth - 2 * margin,
            10,
            darkBlue
          );
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(255, 255, 255);

          xPos = margin + 2;
          headers.forEach((header, i) => {
            doc.text(header, xPos, yPosition + 5);
            xPos += colWidths[i];
          });
          yPosition += 12;
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(0, 0, 0);
        }

        if (index % 2 === 0) {
          addColoredRect(
            margin,
            yPosition - 2,
            pageWidth - 2 * margin,
            8,
            lightBlue
          );
        }

        xPos = margin + 2;
        const rowData = [
          (index + 1).toString(),
          db.name.length > 35 ? db.name.substring(0, 32) + '...' : db.name,
          db.sizeGb.toString(),
        ];

        rowData.forEach((data, i) => {
          doc.text(data, xPos, yPosition + 3);
          xPos += colWidths[i];
        });
        yPosition += 8;
      });

      // Totais
      yPosition += 5;
      addColoredRect(margin, yPosition - 2, pageWidth - 2 * margin, 10, primaryBlue);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);

      const totalSize = databases.reduce((sum, db) => sum + db.sizeGb, 0);

      xPos = margin + 2;
      const totalsData = [
        'TOTAL',
        `${databases.length} databases`,
        totalSize.toString(),
      ];

      totalsData.forEach((data, i) => {
        doc.text(data, xPos, yPosition + 5);
        xPos += colWidths[i];
      });
      yPosition += 20;
    }

    // Atividades de migração
    if (yPosition > pageHeight - 50) {
      doc.addPage();
      yPosition = margin;
    }

    addColoredRect(margin, yPosition, pageWidth - 2 * margin, 8, purple);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('ATIVIDADES DE MIGRAÇÃO', margin + 5, yPosition + 6);
    yPosition += 15;

    if (activities.length > 0) {
      // Caixa de resumo SEM tempo total
      addColoredRect(margin, yPosition, pageWidth - 2 * margin, 12, lightBlue);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(darkBlue[0], darkBlue[1], darkBlue[2]);
      // Se quiser algum título genérico:
      // doc.text('RESUMO DAS ATIVIDADES', margin + 5, yPosition + 8);
      yPosition += 20;

      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);

      activities.forEach((activity, index) => {
        if (yPosition > pageHeight - 25) {
          doc.addPage();
          yPosition = margin;
        }

        // Número da atividade
        addColoredRect(margin, yPosition - 1, 8, 8, primaryBlue);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text((index + 1).toString(), margin + 2, yPosition + 4);

        // Descrição
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        yPosition = addText(
          activity.description,
          margin + 12,
          yPosition + 4,
          pageWidth - margin - 80,
          8
        );

        // Time box da atividade
        addColoredRect(pageWidth - 70, yPosition - 8, 50, 6, lightBlue);
        doc.setFontSize(7);
        doc.text(
          `${activity.team} | ${activity.status} | ${activity.timeEstimate}`,
          pageWidth - 68,
          yPosition - 5
        );

        yPosition += 5;
      });
    }

    // Resumo executivo
    yPosition += 15;
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = margin;
    }

    addColoredRect(margin, yPosition, pageWidth - 2 * margin, 8, darkBlue);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('RESUMO EXECUTIVO', margin + 5, yPosition + 6);
    yPosition += 15;

    if (databases.length > 0) {
      const totalSize = databases.reduce((sum, db) => sum + db.sizeGb, 0);
      const totalMigrationHours = databases.reduce(
        (sum, db) => sum + db.migrationHours,
        0
      );
      // Mantida a lógica caso use em outro lugar, mas não exibimos o total de tempo
      const totalMinutes = activities.reduce((total, activity) => {
        return total + parseTimeStr(activity.timeEstimate);
      }, 0);
      const totalActivityHours = minutesToHHMM(totalMinutes);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);

      const summaryItems = [
        `• Total de bancos de dados: ${databases.length}`,
        `• Tamanho total agregado: ${totalSize} GB`,
        // Linha de tempo total removida para não aparecer
        // `• Tempo estimado para atividades: ${totalActivityHours}`,
        `• Ambiente de destino: ${config.environment}`,
      ];

      summaryItems.forEach((item, index) => {
        if (index % 2 === 0) {
          addColoredRect(
            margin,
            yPosition - 2,
            pageWidth - 2 * margin,
            8,
            lightBlue
          );
        }
        doc.text(item, margin + 5, yPosition + 3);
        yPosition += 8;
      });
    }

    // Rodapé
    const footerY = pageHeight - 15;
    addColoredRect(0, footerY - 5, pageWidth, 20, primaryBlue);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(255, 255, 255);
    doc.text(
      `Relatório gerado em ${new Date().toLocaleDateString(
        'pt-BR'
      )} as ${new Date().toLocaleTimeString('pt-BR')}`,
      margin,
      footerY
    );
    doc.text(
      'DBAOnline - Estimativa de Migração SQL Server',
      pageWidth - margin,
      footerY,
      { align: 'right' }
    );

    const fileName = `relatorio-migracao-${config.clientName
      .replace(/\s+/g, '-')
      .toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  return (
    <Button
      onClick={generatePDF}
      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
    >
      <Download className="w-5 h-5" />
      Gerar PDF Relatório Completo
    </Button>
  );
}
