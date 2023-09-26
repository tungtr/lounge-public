export const slideRight = {
  in: { opacity: 1, transform: 'translateX(10%)' },
  out: { opacity: 0, transform: 'translateX(-10%)' },
  common: { transformOrigin: 'left center' },
  transitionProperty: 'opacity, transform'
}

export const accessItemTooltip = {
  in: { opacity: 1, transform: 'translateX(-5%)' },
  out: { opacity: 0, transform: 'translateX(5%)' },
  common: { transformOrigin: 'right center' },
  transitionProperty: 'opacity, transform'
}

export const loungeCardTooltip = {
  in: { opacity: 1, transform: 'translateY(32%)' },
  out: { opacity: 0, transform: 'translateY(0%)' },
  common: { transformOrigin: 'right top' },
  transitionProperty: 'opacity, transform'
}

export const selectTransition = {
  duration: 100,
  timingFunction: 'ease'
};