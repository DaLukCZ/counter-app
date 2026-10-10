import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastController } from '@ionic/angular';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from '../services/counter.service';
import { Tab1Page } from './tab1.page';

describe('Tab1Page', () => {
  let component: Tab1Page;
  let fixture: ComponentFixture<Tab1Page>;

  const counterServiceMock = {
    add: vi.fn(),
  };

  const toastMock = { present: vi.fn() };
  const toastControllerMock = { create: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    counterServiceMock.add.mockResolvedValue(undefined);
    toastMock.present.mockResolvedValue(undefined);
    toastControllerMock.create.mockResolvedValue(toastMock);

    TestBed.configureTestingModule({
      providers: [
        { provide: CounterService, useValue: counterServiceMock },
        { provide: ToastController, useValue: toastControllerMock },
      ],
    });

    fixture = TestBed.createComponent(Tab1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pass the saved counter to the service', async () => {
    const counter: SavedCounter = {
      id: 'first',
      name: 'První',
      value: 1,
      createdAt: '2026-09-17T08:00:00.000Z',
    };

    await component.onSaved(counter);

    expect(counterServiceMock.add).toHaveBeenCalledWith(counter);
    expect(toastMock.present).toHaveBeenCalledTimes(1);
  });
});
