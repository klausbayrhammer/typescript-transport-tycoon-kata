export enum Destination {
    B
}

enum EventType {
    ProduceOrder = 'ProduceOrder',
    PickUpOrderAtFactory = 'PickUpOrderAtFactory',
    OrderDeliveredAtDestination = 'OrderDeliveredAtDestination'
}

type TransportTycoonEvent = {
    type: EventType;
    time: number;
}

class EventStore {
    private store: TransportTycoonEvent[] = [];
    private processedEvents: TransportTycoonEvent[] = [];

    public addEvent(type: EventType, time: number) {
        this.store.push({type, time})
    }

    public simulate() {
        for (let time: number = 0; !this.allOrdersDelivered(); time++) {
            this.store
                .filter(event => event.time === time)
                .forEach(event => {
                    this.on(event);
                    this.processedEvents.push(event);
                });
        }
        return Math.max(...this.processedEvents
            .filter(({type}) => type === EventType.OrderDeliveredAtDestination)
            .map(({time}) => time), 0);
    }

    on(event: TransportTycoonEvent) {
        switch (event.type) {
            case EventType.PickUpOrderAtFactory:
                if (this.nextFactoryOrder()) {
                    this.addEvent(EventType.OrderDeliveredAtDestination, event.time + 5);
                    this.addEvent(EventType.PickUpOrderAtFactory, event.time + 5 * 2);
                }
        }
    }

    private allOrdersDelivered(): boolean {
        const ordersProduced = this.store.filter(({type}) => type === EventType.ProduceOrder).length;
        const ordersDelivered = this.processedEvents.filter(({type}) => type === EventType.OrderDeliveredAtDestination).length;
        return ordersProduced === ordersDelivered;
    }

    private nextFactoryOrder(): TransportTycoonEvent {
        const ordersPickedUp = this.processedEvents.filter(({type}) => type === EventType.PickUpOrderAtFactory).length;
        return this.processedEvents.filter(({type}) => type === EventType.ProduceOrder)[ordersPickedUp]
    }
}

export default (orders: Destination[]) => {
    const eventStore = new EventStore();
    orders.forEach(() => eventStore.addEvent(EventType.ProduceOrder, 0));
    eventStore.addEvent(EventType.PickUpOrderAtFactory, 0);
    eventStore.addEvent(EventType.PickUpOrderAtFactory, 0);
    return eventStore.simulate();
}
