import transportTycoon, {Destination} from './transport-tycoon';
import {expect} from 'chai';

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
        expect(transportTycoon([Destination.B, Destination.B, Destination.B])).to.equal(15);
    });
    it('deliverytime is 5 with single delivery to A', function () {
        expect(transportTycoon([Destination.A])).to.equal(5);
    });
    it('deliverytime is 13 with two deliveries to A', function () {
        expect(transportTycoon([Destination.A, Destination.A])).to.equal(13);
    });
    it('deliverytime is 13 with two deliveries to A', function () {
        expect(transportTycoon([Destination.A, Destination.B, Destination.B])).to.equal(7);
    });
    it('deliverytime is 15 with ABBB', function () {
        expect(transportTycoon([Destination.A, Destination.B, Destination.B, Destination.B])).to.equal(15);
    });
});
