import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session.service';
import { MeComponent } from './me.component';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from 'src/app/app-routing.module';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { expect } from '@jest/globals';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import '@testing-library/jest-dom'
import { userEvent } from '@testing-library/user-event'
import { screen } from '@testing-library/dom'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let userService: UserService;
  let sessionService: SessionService;
  let router: Router;
  let httpMock: HttpTestingController;
  let location: Location;
  let user = {
    id: 1,
    email: 'string',
    lastName: 'string',
    firstName: 'string',
    admin: false,
    password: 'string',
    createdAt: new Date,
    updatedAt: new Date
  }
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        RouterTestingModule,
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        HttpClientTestingModule
      ],
      providers: [SessionService, UserService, MatSnackBar],
    })
      .compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    sessionService = TestBed.inject(SessionService);
    userService = TestBed.inject(UserService);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    sessionService.sessionInformation = { admin: false,  firstName: '', id: 1, lastName: '', token: 'token', type: 'User', username: 'name'};

    fixture.detectChanges();
  });

  /*--------- Unit tests ----------*/

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set user', () => {
    const userSpy = jest.spyOn(userService,'getById')
      .mockReturnValue(new Observable((subscriber) => { 
        subscriber.next(user)
      }))

    component.ngOnInit();

    expect(component.user?.id).toBe(1);
  })
  
  /*--------- Integration tests ----------*/
  
  it('should delete account', async () => {  
    component.user = user;
    sessionService.isLogged = true;
    
    fixture.detectChanges()

    const button = screen.getAllByRole("button")[1];

    await userEvent.click(button);

    fixture.detectChanges()

    const req = httpMock.expectOne({
      method: 'DELETE',
      url: 'api/user/1',
    });

    req.flush(null, {status: 204, statusText: 'OK'});

    fixture.detectChanges()

    await fixture.whenStable();
    fixture.detectChanges();

    expect(location.path()).toBe('');
  });
});
