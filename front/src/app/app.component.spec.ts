import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { AppComponent } from './app.component';
import { SessionService } from './services/session.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

describe('AppComponent', () => {
  let sessionService: SessionService;
  let router: Router;
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatToolbarModule
      ],
      declarations: [
        AppComponent,
      ],
      providers: [SessionService]
    }).compileComponents();

    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  /*--------- Unit tests ----------*/

  it('should return Observable<boolean>', () => {
    jest.spyOn(sessionService, "$isLogged").mockReturnValue(new Observable<boolean>)
    expect(component.$isLogged()).toBeInstanceOf(Observable<boolean>);
  });

  it('should logout user', () => {
    const sessionSpy = jest.spyOn(sessionService, "logOut")
    const routerSpy = jest.spyOn(router, "navigate")

    component.logout()

    expect(sessionSpy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['']);
  });
});
