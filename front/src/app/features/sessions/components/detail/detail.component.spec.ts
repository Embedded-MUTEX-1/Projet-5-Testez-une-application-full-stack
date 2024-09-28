import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule, } from '@angular/router/testing';
import { expect } from '@jest/globals'; 
import { SessionService } from '../../../../services/session.service';
import { screen } from '@testing-library/dom'
import { DetailComponent } from './detail.component';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { SessionApiService } from '../../services/session-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import userEvent from '@testing-library/user-event';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Location } from '@angular/common';
import { ListComponent } from '../list/list.component';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>; 
  let sessionApiService: SessionApiService;
  let sessionService: SessionService;
  let router: Router;
  let httpMock: HttpTestingController;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'sessions', component: ListComponent}
        ]),
        HttpClientModule,
        MatSnackBarModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        NoopAnimationsModule
      ],
      declarations: [DetailComponent], 
      providers: [
        SessionService,
        SessionApiService,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap( { 'id': '1' } ) } }
        }
      ],
    })
      .compileComponents();

    sessionService = TestBed.inject(SessionService);
    sessionApiService = TestBed.inject(SessionApiService);
    router = TestBed.inject(Router);
    httpMock = TestBed.inject(HttpTestingController);
    location = TestBed.inject(Location);

    sessionService.sessionInformation = { admin: false,  firstName: '', id: 1, lastName: '', token: 'token', type: 'User', username: 'name'};

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*--------- Integration tests ----------*/

  it('should delete a session', async () => { 
    component.isAdmin = true;

    const req1 = httpMock.expectOne({
      method: 'GET',
      url: 'api/session/1',
    });
    
    req1.flush({
      id: 1,
      name: 'test',
      description: 'test',
      date: new Date,
      teacher_id: 1,
      users: [1],
      createdAt: new Date,
      updatedAt: new Date
    }, {status: 200, statusText: 'OK'});

    fixture.detectChanges();

    const button = screen.getAllByRole('button')[1];

    await userEvent.click(button);

    fixture.detectChanges();

    const req2 = httpMock.expectOne({
      method: 'DELETE',
      url: 'api/session/1',
    });
    
    req2.flush(null, {status: 200, statusText: 'OK'});

    fixture.detectChanges();
    await fixture.whenStable();

    expect(location.path()).toBe('/sessions');
  });

  it('should participate to a session', async () => { 
    component.isAdmin = false;

    const req1 = httpMock.expectOne({
      method: 'GET',
      url: 'api/session/1',
    });
    
    req1.flush({
      id: 1,
      name: 'test',
      description: 'test',
      date: new Date,
      teacher_id: 1,
      users: [],
      createdAt: new Date,
      updatedAt: new Date
    }, {status: 200, statusText: 'OK'});

    fixture.detectChanges();

    const button = screen.getAllByRole('button')[1];

    await userEvent.click(button);

    fixture.detectChanges();

    const req2 = httpMock.expectOne({
      method: 'POST',
      url: 'api/session/1/participate/1',
    });
    
    req2.flush(null, {status: 200, statusText: 'OK'});

    fixture.detectChanges();

    const req3 = httpMock.expectOne({
      method: 'GET',
      url: 'api/session/1',
    });
    
    req3.flush({
      id: 1,
      name: 'test',
      description: 'test',
      date: new Date,
      teacher_id: 1,
      users: [1],
      createdAt: new Date,
      updatedAt: new Date
    }, {status: 200, statusText: 'OK'});

    fixture.detectChanges();

    const element = screen.getByText('Do not participate')
    expect(element).toBeTruthy();
  });
});

