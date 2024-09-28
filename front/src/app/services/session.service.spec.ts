import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';
import { firstValueFrom, lastValueFrom, Observable } from 'rxjs';

class UserSession implements SessionInformation {
  token: string = 'Token';
  type: string = 'User';
  id: number = 1;
  username: string = 'Toto';
  firstName: string = 'Tata';
  lastName: string = 'Titi';
  admin: boolean = false;
}

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an Observable', () => {
    expect(service.$isLogged()).toBeInstanceOf(Observable)
  })

  it('should return an Observable', () => {
    expect(service.$isLogged()).toBeInstanceOf(Observable)
  })

  it('should login user', async () => {
    service.logIn(new UserSession());
    expect(service.sessionInformation).toBeDefined()
    expect(service.isLogged).toBe(true)
    expect(await firstValueFrom(service.$isLogged())).toBe(true)
  })

  it('should logout user', async () => {
    service.logOut();
    expect(service.sessionInformation).toBe(undefined)
    expect(service.isLogged).toBe(false)
    expect(await firstValueFrom(service.$isLogged())).toBe(false)
  })
});
