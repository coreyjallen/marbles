import {UIActions, UserActions} from './actions';
import {Observable, merge, of, BehaviorSubject} from 'rxjs';
import {filter, catchError, switchMap} from 'rxjs/operators';

export class MyEffects {

    // This simulates a centralized store, or Subject that emits all the actions application-wide.
    // In NgRx, this is what is subscribed to when you import Actions and what is piped from.
    public mockActionStream: BehaviorSubject<any> = new BehaviorSubject('');
    public mockActionObservable: Observable<any> = of(this.mockActionStream);

    // Should emit a merged observable of UIActions when a SignIn user action is emitted
    public signInEffect$: Observable<any> = this.mockActionStream.pipe(
        filter((action) => action === new UserActions().SignIn),
        switchMap(() => {            
            return merge(
                of(new UIActions().Reset),
                of(new UIActions().LoadMainPane),
                of(new UIActions().AddMessage)
            );
        }),
        catchError(() => of(new UIActions().AddErrorMessage))
    );
}
