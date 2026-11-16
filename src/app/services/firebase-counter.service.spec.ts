import { TestBed } from '@angular/core/testing';
import { FirebaseCounterService } from './firebase-counter.service';

describe('FirebaseCounterService', () => {
  let service: FirebaseCounterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseCounterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
