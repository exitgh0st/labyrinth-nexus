import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Settings } from './settings';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('Settings', () => {
  let component: Settings;
  let fixture: ComponentFixture<Settings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Settings],
      providers: [provideAnimations()]
    }).compileComponents();

    fixture = TestBed.createComponent(Settings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have notification form with default values', () => {
    expect(component.notificationForm.get('emailNotifications')?.value).toBe(true);
    expect(component.notificationForm.get('pushNotifications')?.value).toBe(false);
  });

  it('should save settings', (done) => {
    spyOn(console, 'log');
    component.saveSettings();
    expect(component.isSaving()).toBe(true);

    setTimeout(() => {
      expect(component.isSaving()).toBe(false);
      expect(console.log).toHaveBeenCalled();
      done();
    }, 1100);
  });

  it('should reset settings to defaults', () => {
    component.notificationForm.patchValue({ emailNotifications: false });
    component.resetSettings();
    expect(component.notificationForm.get('emailNotifications')?.value).toBe(true);
  });
});
