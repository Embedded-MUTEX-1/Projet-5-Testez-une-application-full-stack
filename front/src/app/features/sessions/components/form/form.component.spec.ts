import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { FormComponent } from './form.component';
import { Session } from '../../interfaces/session.interface';
import { Observable } from 'rxjs';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { screen } from '@testing-library/dom'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let sessionApiService: SessionApiService;
  let sessionService: SessionService;
  let router: Router;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule, 
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule,
        HttpClientTestingModule
      ],
      providers: 
      [
        SessionService, 
        SessionApiService, 
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap( { 'id': '1' } ) } }
        }
      ],
      declarations: [FormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;

    sessionService = TestBed.inject(SessionService);
    sessionApiService = TestBed.inject(SessionApiService);
    router = TestBed.inject(Router);
    httpMock = TestBed.inject(HttpTestingController);

    sessionService.sessionInformation = { admin: true,  firstName: '', id: 1, lastName: '', token: 'token', type: 'User', username: 'name'};

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*--------- Unit tests ----------*/

  it('should navigate to session if not admin', async () => {
    sessionService.sessionInformation = { admin: false,  firstName: '', id: 1, lastName: '', token: 'token', type: 'User', username: 'name'};
    const navigateSpy = jest.spyOn(router,'navigate');

    await fixture.ngZone?.run(() => {
      component.ngOnInit();
    })

    expect(navigateSpy).toHaveBeenCalledWith(['/sessions']);
  })

  it('should init form', async () => {
    const componentSpy = jest.spyOn(component as any, 'initForm').mockImplementation();

    await fixture.ngZone?.run(() => {
      component.ngOnInit();
    })

    expect(componentSpy).toHaveBeenCalledWith();
  })

  it('should call create when create session', async () => {
    const sessionApiSpy = jest.spyOn(sessionApiService, 'create').mockReturnValue(new Observable<Session>((subscriber) => {subscriber.next()}));
    jest.spyOn(component, 'ngOnInit').mockImplementation();
    jest.spyOn(component as any, 'exitPage').mockImplementation();
    component.onUpdate = false;

    await fixture.ngZone?.run(() => {
      component.submit();
    })

    expect(sessionApiSpy).toHaveBeenCalled();
  })

  it('should call update when update session', () => {
    const sessionApiSpy = jest.spyOn(sessionApiService, 'update').mockReturnValue(new Observable<Session>((subscriber) => {subscriber.next()}));
    jest.spyOn(component, 'ngOnInit').mockImplementation();
    jest.spyOn(component as any, 'exitPage').mockImplementation();
    component.onUpdate = true;

    fixture.ngZone?.run(() => {
      component.submit();
    })

    expect(sessionApiSpy).toHaveBeenCalled();
  })

  /*--------- Integration tests ----------*/

  it('should display prefilled form when update', async () => { 
    jest.spyOn(router, 'url', 'get').mockReturnValue('/update/1');

    const req1 = httpMock.expectOne({
      method: 'GET',
      url: 'api/teacher',
    });
    
    req1.flush([], {status: 200, statusText: 'OK'});

    component.ngOnInit();

    const req2 = httpMock.expectOne({
      method: 'GET',
      url: 'api/session/1',
    });
    
    req2.flush({
      id: 1,
      name: 'test',
      description: 'test description',
      date: new Date().toISOString(),
      teacher_id: 1,
      users: [2, 3],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, {status: 200, statusText: 'OK'});

    fixture.detectChanges();

    const inputName = screen.getByLabelText(/name/i) as HTMLInputElement;
    expect(inputName.value).toBe('test');

    const inputDescription = screen.getByLabelText(/description/i) as HTMLInputElement;
    expect(inputDescription.value).toBe('test description');
  });

  it('should display not prefilled form when create', async () => { 
    const req1 = httpMock.expectOne({
      method: 'GET',
      url: 'api/teacher',
    });
    
    req1.flush([], {status: 200, statusText: 'OK'});

    component.ngOnInit();

    fixture.detectChanges();

    const input = screen.getByLabelText(/name/i) as HTMLInputElement;
    expect(input.value).toBe('');
  });
});
