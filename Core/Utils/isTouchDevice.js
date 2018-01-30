/**
 * Function returns true if current device can handle touch events.
 * @returns {boolean}
 */

const NO_TOUCHES = 0;

export default function isTouchDevice () {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > NO_TOUCHES) ||
        (navigator.msMaxTouchPoints > NO_TOUCHES));
};
