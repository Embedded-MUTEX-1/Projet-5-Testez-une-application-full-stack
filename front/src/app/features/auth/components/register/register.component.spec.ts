import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect, jest } from '@jest/globals';

import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../interfaces/registerRequest.interface';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from 'src/app/app-routing.module';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let formBuilder: FormBuilder;
  let authService: AuthService;
  let router: Router;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [
        { provide: FormBuilder }, 
        { provide: AuthService }
      ],
      imports: [
        RouterTestingModule.withRoutes(routes),
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,  
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ]
    })
      .compileComponents();


    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    formBuilder = TestBed.inject(FormBuilder);
  });

  /*--------- Unit tests ----------*/

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login when no errors', async () => {
    const registerSpy = jest.spyOn(authService, 'register').mockReturnValue(new Observable((subscriber) => {subscriber.next()}));
    const navigateSpy = jest.spyOn(router,'navigate');

    component.form.value.email = 'test@gmail.com';
    component.form.value.firstName = 'test';
    component.form.value.lastName = 'test';
    component.form.value.email = '12345678';

    await fixture.ngZone?.run(() => {
      component.submit();
    });

    expect(registerSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  })

  it('should navigate to login when no errors', async () => {
    const registerSpy = jest.spyOn(authService, 'register').mockReturnValue(new Observable((subscriber) => {subscriber.next()}));
    const navigateSpy = jest.spyOn(router,'navigate');

    component.form.value.email = 'test@gmail.com';
    component.form.value.firstName = 'test';
    component.form.value.lastName = 'test';
    component.form.value.email = '12345678';

    await fixture.ngZone?.run(() => {
      component.submit();
    });

    expect(registerSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  })

  it('should be invalid when field is missing', async () => {
    const registerSpy = jest.spyOn(authService, 'register').mockReturnValue(new Observable((subscriber) => {subscriber.next()}));
    const navigateSpy = jest.spyOn(router,'navigate');

    component.form.value.email = 'test@gmail.com';
    component.form.value.firstName = 'test';
    component.form.value.lastName = 'test';
    component.form.value.email = '12345678';

    await fixture.ngZone?.run(() => {
      component.submit();
    });

    expect(component.form.invalid).toBeTruthy();
  })
});
