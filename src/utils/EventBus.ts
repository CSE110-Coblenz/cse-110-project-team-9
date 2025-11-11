/**
 * Typed EventBus for decoupled pub/sub communication
 * Generic design allows each instance to define its own event schema
 */
export type EventHandler<T> = (data: T) => void;
export type Unsubscribe = () => void;

export class EventBus<Events extends Record<string, any>> {
	private listeners: Map<keyof Events, Set<EventHandler<any>>> = new Map();

	/**
	 * Subscribe to an event
	 * @param eventName - Event key
	 * @param handler - Callback function
	 * @returns Unsubscribe function
	 */
	on<K extends keyof Events>(eventName: K, handler: EventHandler<Events[K]>): Unsubscribe {
		if (!this.listeners.has(eventName)) {
			this.listeners.set(eventName, new Set());
		}
		const handlers = this.listeners.get(eventName)!;
		handlers.add(handler);

		// Return unsubscribe function
		return () => {
			handlers.delete(handler);
		};
	}

	/**
	 * Subscribe to an event once (auto-unsubscribe after first call)
	 */
	once<K extends keyof Events>(eventName: K, handler: EventHandler<Events[K]>): Unsubscribe {
		const unsubscribe = this.on(eventName, (data: Events[K]) => {
			handler(data);
			unsubscribe();
		});
		return unsubscribe;
	}

	/**
	 * Emit an event to all subscribers
	 */
	emit<K extends keyof Events>(eventName: K, data: Events[K]): void {
		const handlers = this.listeners.get(eventName);
		if (handlers) {
			handlers.forEach((handler) => {
				handler(data);
			});
		}
	}

	/**
	 * Clear all listeners for an event (or all if eventName is omitted)
	 */
	clear(eventName?: keyof Events): void {
		if (eventName) {
			this.listeners.delete(eventName);
		} else {
			this.listeners.clear();
		}
	}
}
