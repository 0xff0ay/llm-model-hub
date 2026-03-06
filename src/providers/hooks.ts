/**
 * Provider hooks
 */

import { eventBus } from '../core/events/emitter';

export function setupProviderHooks(): void {
  eventBus.onChat((event) => {
    console.log(`Chat event: ${event.provider}/${event.model}`);
  });

  eventBus.onModel((event) => {
    console.log(`Model event: ${event.action} ${event.model}`);
  });
}
