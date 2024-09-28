import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SessionService } from 'src/app/services/session.service';
import { LoginComponent } from './login.component';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import '@testing-library/jest-dom'
import { userEvent } from '@testing-library/user-event'
import { screen } from '@testing-library/dom'
import { AuthService } from '../../services/auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [SessionService, AuthService],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'sessions', loadChildren: () => import('../../../sessions/sessions.module').then(m => m.SessionsModule), },
        ]),
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
      ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    fixture.detectChanges();
  });

  afterEach(() => {
    // Verify that none of the tests make any extra HTTP requests.
    TestBed.inject(HttpTestingController).verify();
  });

  /*--------- Unit tests ----------*/

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*--------- Integration tests ----------*/

  it('should display session component when good credentials', async () => {
      const emailTextField = screen.getByLabelText(/email/i);
      const passwordTextField = screen.getByLabelText(/password/i, {selector: 'input'});
      const button = screen.getByText("Submit");

      await userEvent.type(emailTextField, "test@test.com");
      await userEvent.type(passwordTextField, "test");

      fixture.detectChanges();
      
      await userEvent.click(button);

      fixture.detectChanges()
      
      await fixture.ngZone?.run(() => {
        const req = httpMock.expectOne({
          method: 'POST',
          url: 'api/auth/login',
        });
        
        req.flush('OK', {status: 200, statusText: 'OK'});
      })
      
      await fixture.whenStable();
      fixture.detectChanges();

      expect(location.path()).toBe('/sessions');
  });

  it('should display error when bad credentials', async () => {
    const emailTextField = screen.getByLabelText(/email/i);
    const passwordTextField = screen.getByLabelText(/password/i, {selector: 'input'});
    const button = screen.getByText("Submit");

    await userEvent.type(emailTextField, "test@test.com");
    await userEvent.type(passwordTextField, "bad password");

    fixture.detectChanges()

    await userEvent.click(button);

    fixture.detectChanges()

    const req = httpMock.expectOne({
      method: 'POST',
      url: 'api/auth/login',
    });

    req.flush('Bad creds!', {status: 401, statusText: 'Bad creds!'});

    fixture.detectChanges()

    expect(await screen.findByText("An error occurred", {}, {timeout: 2000})).toBeDefined();
  });

  it('should disable button and no display error when password missing', async () => {
    const emailTextField = screen.getByLabelText(/email/i);
    const button = screen.getByText("Submit");

    await userEvent.type(emailTextField, "bad email");

    fixture.detectChanges()

    expect(screen.queryByText("An error occurred")).toBeNull();
    expect(button).toBeDisabled();
  });
});
