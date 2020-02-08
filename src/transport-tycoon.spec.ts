import transportTycoon, {Destination} from './transport-tycoon';
import {expect} from 'chai';

[
    {orders: [], time: 0},
    {orders: [Destination.B], time: 5},
    {orders: [Destination.B,Destination.B], time: 5},
    {orders: [Destination.B,Destination.B,Destination.B], time: 15},
    {orders: [Destination.A], time: 5},
    {orders: [Destination.A, Destination.A], time: 13},
    {orders: [Destination.A, Destination.B, Destination.B], time: 7},
    {orders: [Destination.A, Destination.B, Destination.B, Destination.B], time: 15},
].forEach(({orders, time}) => {
    it(`delivers ${orders} in ${time}`, () => {
        expect(transportTycoon(orders)).to.equal(time);
    })
});
