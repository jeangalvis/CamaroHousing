import { TestBed } from '@angular/core/testing';

import { TokenRefreshServiceService } from './token-refresh-service.service';

describe('TokenRefreshServiceService', () => {
  let service: TokenRefreshServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenRefreshServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
