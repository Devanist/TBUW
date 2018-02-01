const SMALL_SCREEN_MAX_WIDTH = 640;
const SMALL_SCREEN_FACTOR = 2;
const BIG_SCREEN_FACTOR = 1;

export function getScreenFactor () {
    return window.innerWidth <= SMALL_SCREEN_MAX_WIDTH ? SMALL_SCREEN_FACTOR : BIG_SCREEN_FACTOR;
};

export function isSmallScreen () {
    return window.innerWidth <= SMALL_SCREEN_MAX_WIDTH;
}
