import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  IonAlert,
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/angular';
import { CounterService } from '../services/counter.service';

export type HistorySort = 'newest' | 'name' | 'value';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    DatePipe,
    IonAlert,
    IonButton,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonSpinner,
    IonTitle,
    IonToast,
    IonToolbar,
  ],
})
export class Tab2Page implements OnInit {
  readonly counterService = inject(CounterService);

  readonly searchTerm = signal('');
  readonly sortBy = signal<HistorySort>('newest');
  readonly toastOpen = signal(false);
  readonly toastMessage = signal('');

  readonly clearAlertButtons = [
    { text: 'Zrušit', role: 'cancel' },
    { text: 'Vymazat', role: 'destructive' },
  ];

  readonly total = computed(() =>
    this.counterService
      .counters()
      .reduce((sum, counter) => sum + counter.value, 0),
  );

  readonly average = computed(() => {
    const counters = this.counterService.counters();
    return counters.length === 0 ? 0 : counters.reduce((sum, counter) => sum + counter.value, 0) / counters.length;
  });

  readonly visibleCounters = computed(() => {
    const term = this.searchTerm().trim().toLocaleLowerCase('cs');
    const filtered = this.counterService
      .counters()
      .filter((counter) =>
        counter.name.toLocaleLowerCase('cs').includes(term),
      );

    switch (this.sortBy()) {
      case 'name':
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'cs'));
      case 'value':
        return [...filtered].sort((a, b) => b.value - a.value);
      default:
        return filtered;
    }
  });

  async ngOnInit(): Promise<void> {
    await this.counterService.initialize();
  }

  onSearch(value: string | null | undefined): void {
    this.searchTerm.set(value ?? '');
  }

  onSortChange(value: unknown): void {
    if (value === 'newest' || value === 'name' || value === 'value') {
      this.sortBy.set(value);
    }
  }

  async remove(id: string): Promise<void> {
    await this.counterService.remove(id);
    this.showToast('Záznam byl odstraněn.');
  }

  async onClearAlertDismiss(role: string | undefined): Promise<void> {
    if (role === 'destructive') {
      await this.counterService.clear();
      this.showToast('Historie byla vymazána.');
    }
  }

  private showToast(message: string): void {
    this.toastMessage.set(message);
    this.toastOpen.set(true);
  }
}
