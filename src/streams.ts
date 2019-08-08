import { throwIfEmpty, filter, map, catchError } from "rxjs/operators";
import { Observable, throwError } from "rxjs";

export class Streams {
    public mockDataStream$: Observable<any>;
    public validatedNumberData$: Observable<any>;

    constructor(testStream: Observable<any>) {
        this.mockDataStream$ = testStream;
        this.validatedNumberData$ = this.mockDataStream$.pipe(
            throwIfEmpty(() => 'Tried to close stream before publishing data'),
            filter((data) => ((typeof data) === 'number')),
            filter((data) => (data % 2 !== 1)),
            map((data) => (data * 2)),
            catchError((error) => throwError(error))
        );
    }
}