import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

interface Report {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  lastGenerated?: Date;
  frequency: string;
}

interface ReportData {
  category: string;
  value: number;
  change: number;
  trend: 'up' | 'down';
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTabsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './reports.html',
  styleUrl: './reports.scss'
})
export class Reports {
  selectedPeriod = signal<string>('week');
  startDate = signal<Date | null>(null);
  endDate = signal<Date | null>(null);

  availableReports: Report[] = [
    {
      id: 'user-activity',
      name: 'User Activity Report',
      description: 'Track user engagement and activity patterns',
      icon: 'people',
      color: '#667eea',
      lastGenerated: new Date(Date.now() - 1000 * 60 * 60 * 2),
      frequency: 'Daily'
    },
    {
      id: 'system-performance',
      name: 'System Performance',
      description: 'Monitor system metrics and performance',
      icon: 'speed',
      color: '#4caf50',
      lastGenerated: new Date(Date.now() - 1000 * 60 * 30),
      frequency: 'Hourly'
    },
    {
      id: 'security-audit',
      name: 'Security Audit Log',
      description: 'Review security events and access logs',
      icon: 'security',
      color: '#ff9800',
      lastGenerated: new Date(Date.now() - 1000 * 60 * 60 * 24),
      frequency: 'Weekly'
    },
    {
      id: 'revenue-analytics',
      name: 'Revenue Analytics',
      description: 'Analyze revenue trends and forecasts',
      icon: 'attach_money',
      color: '#2196f3',
      lastGenerated: new Date(Date.now() - 1000 * 60 * 60 * 48),
      frequency: 'Monthly'
    },
  ];

  summaryData = signal<ReportData[]>([
    { category: 'Total Users', value: 1234, change: 12.5, trend: 'up' },
    { category: 'Active Sessions', value: 456, change: 8.3, trend: 'up' },
    { category: 'API Calls', value: 89234, change: -2.1, trend: 'down' },
    { category: 'Error Rate', value: 0.02, change: -15.4, trend: 'up' },
    { category: 'Avg Response Time', value: 245, change: 5.2, trend: 'down' },
    { category: 'Storage Used', value: 68, change: 3.7, trend: 'up' },
  ]);

  displayedColumns: string[] = ['category', 'value', 'change', 'trend'];

  recentReports = signal([
    {
      name: 'Weekly User Activity',
      type: 'User Activity Report',
      generated: new Date(Date.now() - 1000 * 60 * 60 * 2),
      size: '2.4 MB',
      status: 'completed'
    },
    {
      name: 'Monthly Revenue Summary',
      type: 'Revenue Analytics',
      generated: new Date(Date.now() - 1000 * 60 * 60 * 24),
      size: '1.8 MB',
      status: 'completed'
    },
    {
      name: 'Security Audit Q1',
      type: 'Security Audit Log',
      generated: new Date(Date.now() - 1000 * 60 * 60 * 48),
      size: '5.2 MB',
      status: 'completed'
    },
  ]);

  getRelativeTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }

  generateReport(report: Report): void {
    console.log('Generating report:', report.name);
    // Implement report generation logic
  }

  downloadReport(report: any): void {
    console.log('Downloading report:', report.name);
    // Implement download logic
  }

  exportData(format: string): void {
    console.log('Exporting data as:', format);
    // Implement export logic
  }

  scheduleReport(report: Report): void {
    console.log('Scheduling report:', report.name);
    // Implement scheduling logic
  }

  formatValue(category: string, value: number): string {
    if (category === 'Error Rate') {
      return `${value.toFixed(2)}%`;
    }
    if (category === 'Avg Response Time') {
      return `${value}ms`;
    }
    if (category === 'Storage Used') {
      return `${value}%`;
    }
    return value.toLocaleString();
  }
}
