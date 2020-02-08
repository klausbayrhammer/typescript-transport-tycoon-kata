export enum Destination {
    A = 'A',
    B = 'B'
}

enum EventType {
    PickUpOrderAtFactory = 'PickUpOrderAtFactory',
    PickUpOrderAtPort = 'PickUpOrderAtPort',
    OrderDeliveredAtPort = 'OrderDeliveredAtPort',
    OrderDeliveredAtDestination = 'OrderDeliveredAtDestination'
}

const deliveryTimeToPort = 1;
const deliveryTimeToDestinationA = 4;
const deliveryTimeToDestinationB = 5;

type TransportTycoonEvent = {
    type: EventType;
    time: number;
}

class TransportTycoon {
    constructor(orders: Destination[]) {
        this.state = {
            orders,
            numberOfOrders: orders.length,
            ordersDelivered: 0,
            shipAvailableAtPort: true,
            ordersAvailableAtPort: 0
        };
        this.addEvent(EventType.PickUpOrderAtFactory, 0);
        this.addEvent(EventType.PickUpOrderAtFactory, 0);
    }

    private state: {
        orders: Destination[];
        numberOfOrders: number;
        ordersDelivered: number;
        shipAvailableAtPort: boolean;
        ordersAvailableAtPort: number;
    };

    private events: TransportTycoonEvent[] = [];

    public addEvent(type: EventType, time: number) {
        this.events.push({type, time})
    }

    public simulate() {
        for(let time:number = 0; ; time++){
            this.events
                .filter(event => event.time === time)
                .forEach(event => {
                    this.on(event);
                });

            const allOrdersDelivered = this.state.numberOfOrders === this.state.ordersDelivered;
            if(allOrdersDelivered) {
                return time;
            }
        }
    }

    on(event: TransportTycoonEvent) {
        switch (event.type) {
            case EventType.PickUpOrderAtFactory:
                if (this.state.orders.length > 0) {
                    const nextOrder = this.state.orders.shift();
                    if (nextOrder === Destination.B) {
                        this.addEvent(EventType.OrderDeliveredAtDestination, event.time + deliveryTimeToDestinationB);
                        this.addEvent(EventType.PickUpOrderAtFactory, event.time + deliveryTimeToDestinationB * 2);
                    } else {
                        this.addEvent(EventType.OrderDeliveredAtPort, event.time + deliveryTimeToPort);
                        this.addEvent(EventType.PickUpOrderAtFactory, event.time + deliveryTimeToPort * 2);
                    }
                }
                break;
            case EventType.OrderDeliveredAtPort:
                if (this.state.shipAvailableAtPort) {
                    this.addEvent(EventType.OrderDeliveredAtDestination, event.time + deliveryTimeToDestinationA);
                    this.addEvent(EventType.PickUpOrderAtPort, event.time + deliveryTimeToDestinationA * 2);
                    this.state.shipAvailableAtPort = false;
                } else {
                    this.state.ordersAvailableAtPort++;
                }
                break;
            case EventType.PickUpOrderAtPort:
                if (this.state.ordersAvailableAtPort > 0) {
                    this.addEvent(EventType.OrderDeliveredAtDestination, event.time + 4);
                    this.addEvent(EventType.PickUpOrderAtPort, event.time + 4 * 2);
                    this.state.ordersAvailableAtPort--;
                } else {
                    this.state.shipAvailableAtPort = true;
                }
                break;
            case EventType.OrderDeliveredAtDestination:
                this.state.ordersDelivered++;
        }
    }
}

export default (orders: Destination[]) => {
    const transportTycoon = new TransportTycoon(orders);
    return transportTycoon.simulate();
}
