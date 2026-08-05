import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Estado global de carregamento, alimentado pelo `HttpConfigInterceptor`.
 */
@Injectable({
    providedIn: 'root'
})
export class LoaderService {

    public isLoading = new BehaviorSubject<boolean>(false);
}
