export enum Destination {
    A= 'A',
    B = 'B'
}

enum EventType {
    ProduceOrderA = 'ProduceOrderA',
    ProduceOrderB = 'ProduceOrderB',
    PickUpOrderAtFactory = 'PickUpOrderAtFactory',
    PickUpOrderAtPort = 'PickUpOrderAtPort',
    OrderDeliveredAtDestinationA = 'OrderDeliveredAtDestinationA',
    OrderDeliveredAtDestinationB = 'OrderDeliveredAtDestinationB',
    OrderDeliveredAtPort = 'OrderDeliveredAtPort'
}

type TransportTycoonEvent = {
    type: EventType;
    time: number;
}

class EventStore {
    private world = {
        shipAvailableAt: 0
    };
    private upcomingEvents: TransportTycoonEvent[] = [];
    private processedEvents: TransportTycoonEvent[] = [];

    public addEvent(type: EventType, time: number) {
        this.upcomingEvents.push({type, time})
    }

    public simulate() {
        for (let time: number = 0; !this.allOrdersDelivered(); time++) {
            this.upcomingEvents
                .filter(event => event.time === time)
                .forEach(event => {
                    this.on(event);
                    this.processedEvents.push(event);
                });
        }
        return Math.max(...this.processedEvents
            .filter(({type}) => type === EventType.OrderDeliveredAtDestinationB || type === EventType.OrderDeliveredAtDestinationA)
            .map(({time}) => time), 0);
    }

    on(event: TransportTycoonEvent) {
        switch (event.type) {
            case EventType.PickUpOrderAtFactory:
                const anotherOrderAvailableForPickup = this.nextFactoryOrder();
                if(anotherOrderAvailableForPickup) {
                    if (anotherOrderAvailableForPickup.type === EventType.ProduceOrderB) {
                        this.addEvent(EventType.OrderDeliveredAtDestinationB, event.time + 5);
                        this.addEvent(EventType.PickUpOrderAtFactory, event.time + 5 * 2);
                    } else if (anotherOrderAvailableForPickup.type === EventType.ProduceOrderA) {
                        this.addEvent(EventType.OrderDeliveredAtPort, event.time + 1);
                        this.addEvent(EventType.PickUpOrderAtFactory, event.time + 1 * 2);
                    }
                }
                break;
            case EventType.OrderDeliveredAtPort: {
                if(this.isShipAvailable(event)) {
                    this.addEvent(EventType.OrderDeliveredAtDestinationA, event.time + 4);
                    this.addEvent(EventType.PickUpOrderAtPort, event.time + 4 * 2);
                    this.world.shipAvailableAt = event.time + 4 * 2;
                }
                break;
            }
            case EventType.PickUpOrderAtPort: {
                if(this.isOrderAtPortAvailable()) {
                    this.addEvent(EventType.OrderDeliveredAtDestinationA, event.time + 4);
                    this.addEvent(EventType.PickUpOrderAtPort, event.time + 4 * 2);
                    this.world.shipAvailableAt = event.time + 4 * 2;
                }
            }
        }
    }

    private isShipAvailable(event: TransportTycoonEvent) {
        return this.world.shipAvailableAt <= event.time;
    }

    private isOrderAtPortAvailable(): boolean {
        const orderDeliveredToPort = this.processedEvents.filter(({type}) => type === EventType.OrderDeliveredAtPort).length;
        const ordersPickedUpFromPort = this.processedEvents.filter(({type}) => type === EventType.PickUpOrderAtPort).length;
        return orderDeliveredToPort > ordersPickedUpFromPort;
    }

    private allOrdersDelivered(): boolean {
        const ordersProduced = this.upcomingEvents.filter(({type}) => type === EventType.ProduceOrderA || type === EventType.ProduceOrderB).length;
        const ordersDelivered = this.processedEvents.filter(({type}) => type === EventType.OrderDeliveredAtDestinationA || type === EventType.OrderDeliveredAtDestinationB ).length;
        return ordersProduced === ordersDelivered;
    }

    private nextFactoryOrder(): TransportTycoonEvent | undefined {
        const ordersPickedUp = this.processedEvents.filter(({type}) => type === EventType.PickUpOrderAtFactory).length;
        return this.processedEvents.filter(({type}) => type === EventType.ProduceOrderA || type === EventType.ProduceOrderB)[ordersPickedUp]
    }
}

export default (orders: Destination[]) => {
    const eventStore = new EventStore();
    orders.forEach(order => {
        const produceOrderEvent = order === Destination.B ? EventType.ProduceOrderB : EventType.ProduceOrderA;
        eventStore.addEvent(produceOrderEvent, 0);
    });
    eventStore.addEvent(EventType.PickUpOrderAtFactory, 0);
    eventStore.addEvent(EventType.PickUpOrderAtFactory, 0);
    eventStore.addEvent(EventType.PickUpOrderAtPort, 0);
    return eventStore.simulate();
}
