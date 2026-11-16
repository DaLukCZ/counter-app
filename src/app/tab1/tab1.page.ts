import { Component, inject, signal } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/angular';
import { CounterComponent } from '../components/counter/counter.component';
import { SavedCounter } from '../models/saved-counter';
import { FirebaseCounterService } from '../services/firebase-counter.service';

//test comment

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    CounterComponent,
    IonContent,
    IonHeader,
    IonTitle,
    IonToast,
    IonToolbar,
  ],
})
export class Tab1Page {
  private readonly counterService = inject(FirebaseCounterService);

  readonly toastOpen = signal(false);
  readonly toastMessage = signal('');

  async onSaved(counter: SavedCounter): Promise<void> {
    await this.counterService.add(counter);
    this.showToast(`Počítadlo „${counter.name}“ bylo uloženo.`);
  }

  private showToast(message: string): void {
    this.toastMessage.set(message);
    this.toastOpen.set(true);
  }
}
