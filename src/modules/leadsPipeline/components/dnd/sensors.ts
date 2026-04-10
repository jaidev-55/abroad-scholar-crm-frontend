import { PointerSensor, useSensor, useSensors } from "@dnd-kit/core";

/**
 * Configures DnD sensors with an 8px activation threshold so that
 * a normal click on a card does not accidentally start a drag.
 */
export function useLeadSensors() {
  return useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );
}
