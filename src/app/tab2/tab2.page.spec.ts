import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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

  beforeEach(() => {
    vi.clearAllMocks();
    counterServiceMock.counters.set([visitors, cars]);
    counterServiceMock.initialize.mockResolvedValue(undefined);
    counterServiceMock.remove.mockResolvedValue(undefined);
    counterServiceMock.clear.mockResolvedValue(undefined);

    TestBed.configureTestingModule({
      providers: [{ provide: CounterService, useValue: counterServiceMock }],
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
    await component.onClearAlertDismiss('cancel');
    expect(counterServiceMock.clear).not.toHaveBeenCalled();
    expect(component.toastOpen()).toBe(false);

    await component.onClearAlertDismiss('destructive');
    expect(counterServiceMock.clear).toHaveBeenCalledTimes(1);
    expect(component.toastOpen()).toBe(true);
    expect(component.toastMessage()).toBe('Historie byla vymazána.');
  });

  it('should show a toast after removing a counter', async () => {
    await component.remove('cars');

    expect(counterServiceMock.remove).toHaveBeenCalledWith('cars');
    expect(component.toastOpen()).toBe(true);
    expect(component.toastMessage()).toBe('Záznam byl odstraněn.');
  });
});
