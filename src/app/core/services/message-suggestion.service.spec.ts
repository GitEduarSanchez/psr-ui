import { TestBed } from '@angular/core/testing';

import { MessageSuggestionService } from './message-suggestion.service';

describe('MessageSuggestionService', () => {
  let service: MessageSuggestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageSuggestionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
