import { Pipe, PipeTransform } from '@angular/core';
import { IUserInformation } from '../../core/interfaces';
import { FilterPipeSearchCriteria } from '../interfaces/filter-pipe-search-criteria.interface';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class FilterPipe implements PipeTransform {

  transform(items: IUserInformation[], searchInputs: FilterPipeSearchCriteria): IUserInformation[] {
    if (!items) return [];
    if (!searchInputs) return items;

    const finalItems = items.filter(item => {

      const matchesName = searchInputs.name ? item.person.name.toLowerCase().includes(searchInputs.name.toLowerCase()) : true;

      const matchesCity = searchInputs.city ? item.address.some(address => address.city.toLowerCase().includes(searchInputs.city.toLowerCase())) : true;

      const matchesNeighborhood = searchInputs.neighborhood ? item.address.some(address => address.neighborhood.toLowerCase().includes(searchInputs.neighborhood.toLowerCase())) : true;

      return matchesName && matchesCity && matchesNeighborhood
    })

    return finalItems
  }

}
