if (!process.env.ARTNET_DMX_FPS) throw new Error("ARTNET_DMX_FPS is not defined");

export const dmxTransitionInterval = 1000 / parseInt(process.env.ARTNET_DMX_FPS as string);

export function getSteps(current: number, target: number) {
  console.log("getSteps", { current, target });
  if (current === undefined || target === undefined) {
    console.log("getSteps args missings", { current, target });
    return [];
  }
  const steps = [];
  const step  = current < target ? 1 : -1;
  while (current !== target) { steps.push(Math.round(current)); current += step; }
  steps.push(target);
  console.log("steps", steps);
  return steps;
}