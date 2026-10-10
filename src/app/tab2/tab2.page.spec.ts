import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from '../services/counter.service';
import { Tab2Page } from './tab2.page';

describe('Tab2Page', () => {
  let component: Tab2Page;
  let fixture: ComponentFixture<Tab2Page>;

  const counterServiceMock = {
    counters: signal<SavedCounter[]>([]),
    initialized: signal(true),
    initialize: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    counterServiceMock.initialize.mockResolvedValue(undefined);

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
});
