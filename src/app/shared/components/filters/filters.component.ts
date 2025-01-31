import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Address, IUserInformation, Person } from '../../../core/interfaces';
import { TranslationService } from '../../../core/services/translation.service';
import { FilterPipeSearchCriteria } from '../../interfaces/filter-pipe-search-criteria.interface';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    ReactiveFormsModule
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss'
})
export class FiltersComponent {
  public translations: any;

  public uniqueCities!: string[];
  public uniqueNeighborhoods!: string[];
  public uniqueZones!: string[];
  public uniquePersons!: string[];

  public searchCriteria: FilterPipeSearchCriteria = {
    city: '',
    state: undefined,
    name: '',
    neighborhood: '',
  };

  private searchCriteriaSubject$ = new Subject<FilterPipeSearchCriteria>();

  @Input() data: IUserInformation[] = [];

  @Output() filtersChanged = new EventEmitter<any>();

  constructor(
    private translationService: TranslationService,
  ) { }

  ngOnInit() {
    this.translationService.selectedLanguage$.subscribe(() => {
      this.translations = this.translationService.getTranslations();
    });

    this.searchCriteriaSubject$
    .pipe(debounceTime(300))
    .subscribe(() => {
      this.filterAutocomplete();
    });
  }

  public onFilter() {
    this.filtersChanged.emit(this.searchCriteria);
  }

  public onSearchCriteriaChange() {
    this.searchCriteriaSubject$.next(this.searchCriteria);
  }

  public filterAutocomplete() {
    if (this.searchCriteria) {
        const { uniqueCities, uniqueNeighborhoods, uniquePersons } = this.filterData();
        this.uniqueCities = uniqueCities;
        this.uniqueNeighborhoods = uniqueNeighborhoods;
        this.uniquePersons = uniquePersons;
    }
  }

  public onClearFilters() {
    this.searchCriteria = {
      city: '',
      name: '',
      neighborhood: '',
      state: undefined,
    }
    this.filtersChanged.emit(this.searchCriteria);
    this.filterAutocomplete();
  }

  private filterData() {
    let filteredAddresses: Address[] = [];
    let filteredPersons: Person[] = [];

    this.data.forEach((user) => {
      const addresses = user.address.filter(address => {
        const matchesCity = this.searchCriteria.city
          ? address.city.toLowerCase().includes(this.searchCriteria.city.toLowerCase())
          : true;

        const matchesNeighborhood = this.searchCriteria.neighborhood
          ? address.neighborhood.toLowerCase().includes(this.searchCriteria.neighborhood.toLowerCase())
          : true;

        return matchesCity && matchesNeighborhood;
      });

      filteredAddresses = filteredAddresses.concat(addresses);

      if (this.searchCriteria.name) {
        const matchesName = user.person.name.toLowerCase().includes(this.searchCriteria.name.toLowerCase());
        if (matchesName) {
          filteredPersons.push(user.person);
        }
      }
    });

    return {
      uniqueCities: [...new Set(filteredAddresses.map(addr => addr.city))],
      uniqueNeighborhoods: [...new Set(filteredAddresses.map(addr => addr.neighborhood))],
      uniquePersons: [...new Set(filteredPersons.map(person => person.name))]
    };
  }
}