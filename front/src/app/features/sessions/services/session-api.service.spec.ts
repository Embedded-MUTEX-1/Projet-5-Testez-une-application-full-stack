import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionApiService } from './session-api.service';
import { Session } from '../interfaces/session.interface';
import { of } from 'rxjs/internal/observable/of';
import { firstValueFrom, Observable } from 'rxjs';

describe('SessionsService', () => {
  let service: SessionApiService;
  let httpClient: HttpClient;
  const session: Session = {
    id: 1,
    name: 'test',
    description: 'test',
    date: new Date,
    teacher_id: 1,
    users: [],
    createdAt: new Date,
    updatedAt: new Date
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule
      ],
      providers:[HttpClient]
    });
    service = TestBed.inject(SessionApiService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /*--------- Unit tests ----------*/

  it('should crate and return session', () => {
    const httpSpy = jest.spyOn(httpClient, "post").mockReturnValue(of(session));

    service.create(session);

    expect(httpSpy).toHaveBeenCalledWith('api/session', session);
  });

  it('should create and return session', async () => {
    const httpSpy = jest.spyOn(httpClient, "post").mockReturnValue(of(session));

    const ret = service.create(session);

    expect(httpSpy).toHaveBeenCalledWith('api/session', session);
    expect(await firstValueFrom(ret)).toBe(session);
  });

  it('should update and return session', async () => {
    const httpSpy = jest.spyOn(httpClient, "put").mockReturnValue(of(session));

    const ret = service.update('1' , session);

    expect(httpSpy).toHaveBeenCalledWith('api/session/1', session);
    expect(await firstValueFrom(ret)).toBe(session);
  });

  it('should return a session', async () => {
    const httpSpy = jest.spyOn(httpClient, "get").mockReturnValue(of(session));

    const ret = service.detail('1');

    expect(httpSpy).toHaveBeenCalledWith('api/session/1');
    expect(await firstValueFrom(ret)).toBe(session);
  });

  it('should delete a session', async () => {
    const httpSpy = jest.spyOn(httpClient, "delete").mockReturnValue(of());

    const ret = service.delete('1');

    expect(httpSpy).toHaveBeenCalledWith('api/session/1');
    expect(ret).toBeInstanceOf(Observable<any>);
  });
});
