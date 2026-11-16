import { Injectable, inject, signal } from '@angular/core';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';
import { firestore } from '../firebase.client';
import { SavedCounter } from '../models/saved-counter';
import { FirebaseAuthService } from './firebase-auth.service';

@Injectable({ providedIn: 'root' })
export class FirebaseCounterService {
  private readonly auth = inject(FirebaseAuthService);
  private readonly countersState = signal<SavedCounter[]>([]);
  private readonly initializedState = signal(false);
  private readonly errorState = signal('');
  private connectionPromise: Promise<void> | null = null;

  readonly counters = this.countersState.asReadonly();
  readonly initialized = this.initializedState.asReadonly();
  readonly errorMessage = this.errorState.asReadonly();

  initialize(): Promise<void> {
    if (this.connectionPromise === null) {
      this.connectionPromise = this.connect();
    }

    return this.connectionPromise;
  }

  async add(counter: SavedCounter): Promise<void> {
    this.errorState.set('');

    try {
      const counters = await this.userCounters();
      await setDoc(doc(counters, counter.id), counter);
    } catch (error) {
      console.error(error);
      this.errorState.set('Záznam se nepodařilo uložit.');
    }
  }

  async remove(id: string): Promise<void> {
    this.errorState.set('');

    try {
      const counters = await this.userCounters();
      await deleteDoc(doc(counters, id));
    } catch (error) {
      console.error(error);
      this.errorState.set('Záznam se nepodařilo odstranit.');
    }
  }

  private async userCounters() {
    const uid = await this.auth.initialize();
    return collection(firestore, 'users', uid, 'counters');
  }

  private async connect(): Promise<void> {
    try {
      const counters = await this.userCounters();
      const countersQuery = query(counters, orderBy('createdAt', 'desc'));

      onSnapshot(
        countersQuery,
        (snapshot) => {
          const items = snapshot.docs.map((item) => item.data() as SavedCounter);
          this.countersState.set(items);
          this.initializedState.set(true);
        },
        (error) => {
          console.error(error);
          this.errorState.set('Živou historii se nepodařilo načíst.');
          this.initializedState.set(true);
        },
      );
    } catch (error) {
      console.error(error);
      this.errorState.set('Připojení k historii se nezdařilo.');
      this.initializedState.set(true);
    }
  }
}
