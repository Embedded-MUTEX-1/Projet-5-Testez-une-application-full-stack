import { TestBed } from '@angular/core/testing';
import { SessionService } from '../services/session.service';
import { AuthGuard } from './auth.guard';
import { UnauthGuard } from './unauth.guard';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from '../app-routing.module';
import { expect } from '@jest/globals';

class SessionServiceMock extends SessionService {
    public override isLogged = true;
}

describe('Auth guard tester suit', () => {
    let router: Router

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes(routes),
            ],
            providers: []
        });

        router = TestBed.inject(Router);
    });

    it('should return true if logged', () => {
        const service = new SessionServiceMock()
        const guard = new AuthGuard(router, service);

        expect(guard.canActivate()).toBeTruthy();
    })

    it('should return false if not logged', () => {
        const navigateSpy = jest.spyOn(router,'navigate');
        const service = new SessionServiceMock()
        service.isLogged = false;
        const guard = new AuthGuard(router, service);

        expect(guard.canActivate()).toBeFalsy();
        expect(navigateSpy).toHaveBeenCalled();
    })
});

describe('Unauth guard tester suit', () => {

    let router: Router

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes(routes),
            ],
            providers: []
        });

        router = TestBed.inject(Router);
    });

    it('should return false if logged', () => {
        const navigateSpy = jest.spyOn(router,'navigate');
        const service = new SessionServiceMock()
        const guard = new UnauthGuard(router, service);

        expect(guard.canActivate()).toBeFalsy();
        expect(navigateSpy).toHaveBeenCalled();
    })

    it('should return true if not logged', () => {
        const service = new SessionServiceMock()
        service.isLogged = false;
        const guard = new UnauthGuard(router, service);

        expect(guard.canActivate()).toBeTruthy();
    })
});