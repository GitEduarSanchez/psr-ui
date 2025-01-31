import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'search',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent<T> implements OnInit{

  @Input() placeholder: string = 'Search...';
  @Input() data: T[] = [];
  @Input() searchKey?: keyof T;

  @Output() filteredResults = new EventEmitter<T[]>();

  public searchTerm: string = '';

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.searchSubject
    .pipe(debounceTime(300))
    .subscribe((searchValue) => {
      this.searchValues(searchValue);
    });
  }

  public onSearchChange(value: string) {
    this.searchSubject.next(value);
  }

  private searchValues(searchValue: string): void {
    const filtered = this.data.filter((item) => {
      if (this.searchKey && typeof item === 'object') {
        const keyValue = item![this.searchKey];
        return typeof keyValue === 'string' && 
        keyValue.toLowerCase().includes(searchValue.toLowerCase());
      }
      return typeof item === 'string' && 
      item.toLowerCase().includes(searchValue.toLowerCase());
    });

    this.filteredResults.emit(filtered);
  }

}
