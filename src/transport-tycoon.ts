export enum Destination {
    B
}

enum EventType {
    ProduceOrder,
    PickUpOrderAtFactory,
    OrderDeliveredAtDestination
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
        this.store.forEach(event => {
            this.on(event);
            this.processedEvents.push(event);
        });
        return Math.max(...this.store
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

    private nextFactoryOrder(): TransportTycoonEvent {
        const ordersPickedUp = this.processedEvents.filter(({type}) => type === EventType.PickUpOrderAtFactory).length;
        return this.processedEvents.filter(({type}) => type === EventType.ProduceOrder)[ordersPickedUp - 1]
    }
}

export default (orders: Destination[]) => {
    const eventStore = new EventStore();
    orders.forEach(order => eventStore.addEvent(EventType.ProduceOrder, 0));
    eventStore.addEvent(EventType.PickUpOrderAtFactory, 0);
    eventStore.addEvent(EventType.PickUpOrderAtFactory, 0);
    return eventStore.simulate();
}
