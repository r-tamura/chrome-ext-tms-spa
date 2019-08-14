function miwWidthMediaQuery(breakpoint: number) {
  return `@media (min-width: ${breakpoint}px)`;
}

export const MQ_XS = miwWidthMediaQuery(544);
export const MQ_S = miwWidthMediaQuery(768);
export const MQ_M = miwWidthMediaQuery(992);
export const MQ_L = miwWidthMediaQuery(1200);
