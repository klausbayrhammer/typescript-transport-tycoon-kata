import transportTycoon, {Destination} from './transport-tycoon';
import { expect } from 'chai';

describe('transport-tycoon.ts', function () {
    it('deliverytime is zero if there are no orders', function () {
        expect(transportTycoon([])).to.equal(0);
    });
    it('deliverytime is 5 with a single order to B', function () {
        expect(transportTycoon([Destination.B])).to.equal(5);
    });
    it('deliverytime is 5 with two orders to B', function () {
        expect(transportTycoon([Destination.B, Destination.B])).to.equal(5);
    });
    it('deliverytime is 10 with three orders to B', function () {
        expect(transportTycoon([Destination.B, Destination.B, Destination.B])).to.equal(10);
    });
});
