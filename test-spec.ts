import { marbles, cases } from "rxjs-marbles/mocha";

import { MyEffects } from './src/effects';
import { UIActions, UserActions } from './src/actions';
import { Streams } from './src/streams';

describe("signInEffect$", () => {
    let testEffects: MyEffects;

    beforeEach(() => {
        testEffects = new MyEffects();
    });

    it("should create UIActions on successful login", marbles(marble => {
        testEffects.mockActionStream.next(new UserActions().SignIn);

        const expectedActions = {
            a: new UIActions().Reset,
            b: new UIActions().LoadMainPane,
            c: new UIActions().AddMessage
        };
        const expected = marble.cold("(abc)", expectedActions);

        marble.expect(testEffects.signInEffect$).toBeObservable(expected);
    }));

    it("should create AddErrorMessage action on SignIn failure", marbles(marble => {
        testEffects.mockActionStream.error('random error');

        // test that it errors out, and completes correctly
        const expectedActions = {
            a: new UIActions().AddErrorMessage,
        };
        const expected = marble.cold("(a|)", expectedActions);  // NOTE: the | denotes that the observable should have completed
        marble.expect(testEffects.signInEffect$).toBeObservable(expected);

        // The stream should stay closed after an error scenario 
        testEffects.mockActionStream.next(new UserActions().SignIn);
        marble.expect(testEffects.signInEffect$).toBeObservable(expected);
    }));

    cases("should only be triggered by SignIn actions", (marble, collateral) => {
        testEffects.mockActionStream.next(collateral.action);        
        const expected = marble.cold(''); // nothing should be created
        
        marble.expect(testEffects.signInEffect$).toBeObservable(expected);
    }, {
        "SignOut": {
            action: new UserActions().SignOut,
        },
        "LoadMainPane": {
            action: new UIActions().LoadMainPane,
        }
    });
});

describe('validatedNumberData$', () => {
    let testStreams: Streams;

    it("should double the provided stream of numbers", marbles(marble => {
        const sourceData = {
            a: 6,
            b: 158,
            c: 90
        };
        const expectedData = {
            a: 12,
            b: 316,
            c: 180
        };
        const source = marble.cold(   '--a-b--c--|', sourceData);
        const expected = marble.cold( '--a-b--c--|', expectedData);

        testStreams = new Streams(source);
        const destination = testStreams.validatedNumberData$;

        marble.expect(destination).toBeObservable(expected);
    }));

    it("should throw error if stream completes without providing data", marbles(marble => {

        const source = marble.cold(  '--|');
        const expected = marble.cold('--#', undefined, 'Tried to close stream before publishing data');

        testStreams = new Streams(source);    
        const destination = testStreams.validatedNumberData$;

        marble.expect(destination).toBeObservable(expected);
    }));

    it("should throw unedited errors", marbles(marble => {
        const sourceData = {
            a: 6,
            b: 158,
            c: 90
        };
        const expectedData = {
            a: 12,
            b: 316,
            c: 180
        };
        const source = marble.cold(  '--a--b--c-#|', sourceData, 'do not modify, let this error message pass through' );
        const expected = marble.cold('--a--b--c-#', expectedData, 'do not modify, let this error message pass through');

        testStreams = new Streams(source);    
        const destination = testStreams.validatedNumberData$;

        marble.expect(destination).toBeObservable(expected);
    }));

    it("should not allow odd numbers", marbles(marble => {
        const sourceData = {
            a: 6,
            b: 159,
            c: 158,
            d: 90,
            e: 1
        };
        const expectedData = {
            a: 12,
            b: 316,
            c: 180
        };
        const source = marble.cold(   '--a-b--c-d-e|', sourceData);
        const expected = marble.cold( '--a----b-c--|', expectedData);

        testStreams = new Streams(source);
        const destination = testStreams.validatedNumberData$

        marble.expect(destination).toBeObservable(expected);
    }));

    it("should only operate on number types", marbles(marble => {
        const sourceData = {
            a: 6,
            b: 'You should play Destiny2',
            c: ['a','b', 8],
            d: false,
            e: true
        };
        const expectedData = {
            a: 12
        };
        const source = marble.cold(   '--a-b--c-d-e|', sourceData);
        const expected = marble.cold( '--a---------|', expectedData);

        testStreams = new Streams(source);
        const destination = testStreams.validatedNumberData$

        marble.expect(destination).toBeObservable(expected);
    }));
});