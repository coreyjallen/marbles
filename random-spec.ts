import { marbles } from "rxjs-marbles/mocha";
import { merge } from "rxjs";

describe('Random suite ', () => {
    it("should merge streams from two different markets", marbles(marble => {

        const nasdaqStream = {
            a: 1,
            b: 3,
            c: 4
        };

        const dowStream = {
            d: 2,
            e: 5,
            f: 6
        };

        const expectedStream = {
            a: 1,
            b: 3,
            c: 4,
            d: 2,
            e: 5,
            f: 6
        };

        // this is the only reason this random test exists.  Illustrating the ligning up on the strings that draws the marble diagrams in text
        const nasdaq =  marble.hot("^-a-b-c-|", nasdaqStream);
        const dow =     marble.hot("^--d----e-f|", dowStream);
        const result = marble.cold("--adb-c-e-f|", expectedStream);

        const nasdaqSubs =         "^-------!";
        const dowSubs =            "^----------!";

        const testStream = merge(nasdaq, dow);
        
        marble.expect(testStream).toBeObservable(result);
        marble.expect(nasdaq).toHaveSubscriptions(nasdaqSubs);        
        marble.expect(dow).toHaveSubscriptions(dowSubs);
    }));
});