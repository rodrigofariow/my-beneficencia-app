/**
 * Allows multiple refs to the same element to be acquired so that none is overwritten by another
 */
export function combineRefs<E>(
  ...refs: Array<((instance: E | null) => void) | React.RefObject<E> | null | undefined>
) {
  return (instance: E) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(instance)
      } else if (ref) {
        const refAny = ref as any

        refAny.current = instance
      }
    })
  }
}
