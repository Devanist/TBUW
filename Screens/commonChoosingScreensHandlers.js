import isTouchDevice from "../Core/Utils/isTouchDevice";

export function handleKeyboardInput (keysState) {
    const FIRST_ELEMENT = 0;
    const LAST_ELEMENT = this._guiStage._elements.length - 1; //eslint-disable-line no-magic-numbers

    const OLD_ELEMENT_HIGHLIGHTED = 1;
    const NEW_ELEMENT_HIGHLIGHTED = 2;
    let element, step, elementIndex;

    if ((keysState.ARROW_DOWN || keysState.S) && !this._buttonPressedDown) {
        this._buttonPressedDown = true;
        while (step !== NEW_ELEMENT_HIGHLIGHTED) {
            if (elementIndex === this._guiStage._elements.length) elementIndex = FIRST_ELEMENT;

            element = this._guiStage._elements[elementIndex];
            if (element && element.isEnabled() && element.isActive()) {
                element._data.active = false;
                element._sprite.filters = null;
                step = OLD_ELEMENT_HIGHLIGHTED;
                elementIndex += 1; //eslint-disable-line no-magic-numbers
                continue;
            }
            if (step === OLD_ELEMENT_HIGHLIGHTED && element && element.isEnabled()) {
                element._data.active = true;
                step = NEW_ELEMENT_HIGHLIGHTED;
            }
            else {
                elementIndex += 1; //eslint-disable-line no-magic-numbers
            }
        }
    }

    if ((keysState.ARROW_UP || keysState.W) && this._buttonPressedDown === false) {
        this._buttonPressedDown = true;
        while (step !== NEW_ELEMENT_HIGHLIGHTED) {
            if (elementIndex === -1) { //eslint-disable-line no-magic-numbers
                elementIndex = LAST_ELEMENT;
            }
            element = this._guiStage._elements[elementIndex];
            if (element && element.isEnabled() && element.isActive()) {
                element._data.active = false;
                element._sprite.filters = null;
                step = OLD_ELEMENT_HIGHLIGHTED;
                elementIndex -= 1; //eslint-disable-line no-magic-numbers
                continue;
            }
            if (step === OLD_ELEMENT_HIGHLIGHTED && element && element.isEnabled()) {
                element._data.active = true;
                step = NEW_ELEMENT_HIGHLIGHTED;
            }
            else {
                elementIndex -= 1; //eslint-disable-line no-magic-numbers
            }
        }
    }

    if (keysState.ENTER) {
        this._guiStage._elements.forEach((guiElement) => {
            if (guiElement && guiElement.isActive()) guiElement.triggerCallback()
        });
    }

    if (!keysState.ARROW_DOWN && !keysState.S && !keysState.ARROW_UP && !keysState.W) {
        this._buttonPressedDown = false;
    }
}

export function handleMouseInput (clicks) {
    clicks.forEach((click) => {
        const { clientX: x, clientY: y } = click;
        this._guiStage._elements.forEach((element) => {
            if (element.triggerCallback && element._sprite.containsPoint({x, y})) element.triggerCallback();
        });
    });
}

export function handleTouchInput (touches) {
    if (!isTouchDevice()) return;

    touches.forEach((touch) => {
        const { pageX: x, pageY: y } = touch;
        this._guiStage._elements.forEach((element) => {
            if (element.triggerCallback && element._sprite.containsPoint({x, y})) element.triggerCallback();
        });
    });
}
