import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

constructor() { }
private searchTerm = new BehaviorSubject<string>('');
currentSearchTerm = this.searchTerm.asObservable();
updateSearchTerm(term: string) {
  this.searchTerm.next(term);
}
}
