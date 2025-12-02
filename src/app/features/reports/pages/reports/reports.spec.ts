import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Reports } from './reports';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('Reports', () => {
  let component: Reports;
  let fixture: ComponentFixture<Reports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reports],
      providers: [provideAnimations()]
    }).compileComponents();

    fixture = TestBed.createComponent(Reports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have available reports', () => {
    expect(component.availableReports.length).toBeGreaterThan(0);
  });

  it('should have summary data', () => {
    expect(component.summaryData().length).toBeGreaterThan(0);
  });

  it('should format values correctly', () => {
    expect(component.formatValue('Error Rate', 0.02)).toBe('0.02%');
    expect(component.formatValue('Avg Response Time', 245)).toBe('245ms');
    expect(component.formatValue('Storage Used', 68)).toBe('68%');
    expect(component.formatValue('Total Users', 1234)).toBe('1,234');
  });

  it('should calculate relative time correctly', () => {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    expect(component.getRelativeTime(fiveMinutesAgo)).toBe('5 minutes ago');
  });

  it('should handle report generation', () => {
    spyOn(console, 'log');
    const report = component.availableReports[0];
    component.generateReport(report);
    expect(console.log).toHaveBeenCalledWith('Generating report:', report.name);
  });

  it('should handle report download', () => {
    spyOn(console, 'log');
    const report = component.recentReports()[0];
    component.downloadReport(report);
    expect(console.log).toHaveBeenCalledWith('Downloading report:', report.name);
  });

  it('should handle report scheduling', () => {
    spyOn(console, 'log');
    const report = component.availableReports[0];
    component.scheduleReport(report);
    expect(console.log).toHaveBeenCalledWith('Scheduling report:', report.name);
  });
});
