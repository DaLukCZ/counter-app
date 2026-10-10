import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertController, ToastController } from '@ionic/angular';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from '../services/counter.service';
import { Tab2Page } from './tab2.page';

describe('Tab2Page', () => {
  let component: Tab2Page;
  let fixture: ComponentFixture<Tab2Page>;

  const visitors: SavedCounter = {
    id: 'visitors',
    name: 'Návštěvníci',
    value: 2,
    createdAt: '2026-09-17T09:00:00.000Z',
  };

  const cars: SavedCounter = {
    id: 'cars',
    name: 'Auta',
    value: 5,
    createdAt: '2026-09-17T08:00:00.000Z',
  };

  const counterServiceMock = {
    counters: signal<SavedCounter[]>([]),
    initialized: signal(true),
    initialize: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
  };

  const alertMock = { present: vi.fn(), onDidDismiss: vi.fn() };
  const alertControllerMock = { create: vi.fn() };
  const toastMock = { present: vi.fn() };
  const toastControllerMock = { create: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    counterServiceMock.counters.set([visitors, cars]);
    counterServiceMock.initialize.mockResolvedValue(undefined);
    counterServiceMock.remove.mockResolvedValue(undefined);
    counterServiceMock.clear.mockResolvedValue(undefined);
    alertMock.present.mockResolvedValue(undefined);
    alertControllerMock.create.mockResolvedValue(alertMock);
    toastMock.present.mockResolvedValue(undefined);
    toastControllerMock.create.mockResolvedValue(toastMock);

    TestBed.configureTestingModule({
      providers: [
        { provide: CounterService, useValue: counterServiceMock },
        { provide: AlertController, useValue: alertControllerMock },
        { provide: ToastController, useValue: toastControllerMock },
      ],
    });

    fixture = TestBed.createComponent(Tab2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the service on start', () => {
    expect(counterServiceMock.initialize).toHaveBeenCalledTimes(1);
  });

  it('should compute the sum of all values', () => {
    expect(component.total()).toBe(7);
  });

  it('should filter counters by name', () => {
    component.onSearch('návš');

    expect(component.visibleCounters()).toEqual([visitors]);
  });

  it('should sort counters by name and by value', () => {
    component.onSortChange('name');
    expect(component.visibleCounters()).toEqual([cars, visitors]);

    component.onSortChange('value');
    expect(component.visibleCounters()).toEqual([cars, visitors]);

    component.onSortChange('newest');
    expect(component.visibleCounters()).toEqual([visitors, cars]);
  });

  it('should clear the history only after confirmation', async () => {
    alertMock.onDidDismiss.mockResolvedValue({ role: 'cancel' });
    await component.clear();
    expect(counterServiceMock.clear).not.toHaveBeenCalled();

    alertMock.onDidDismiss.mockResolvedValue({ role: 'destructive' });
    await component.clear();
    expect(counterServiceMock.clear).toHaveBeenCalledTimes(1);
  });

  it('should show a toast after removing a counter', async () => {
    await component.remove('cars');

    expect(counterServiceMock.remove).toHaveBeenCalledWith('cars');
    expect(toastMock.present).toHaveBeenCalledTimes(1);
  });
});
