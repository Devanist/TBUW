export default class TouchDevice {
    constructor () {
        this._onGoingTouches = [];
    }

    handleTouchStart (event) {
        event.preventDefault();
        if (!event.changedTouches) {
            this._onGoingTouches.push(this.copyTouch(event));
            return;
        }
        event.changedTouches.forEach((touch) => {
            this._onGoingTouches.push(this.copyTouch(touch));
        });
    }

    handleTouchEnd (event) {
        event.preventDefault();

        if (!event.changedTouches) {
            const index = this.ongoingTouchIndexById(event.pointerId);
            this._onGoingTouches.splice(index, 1); // eslint-disable-line no-magic-numbers
            return;
        }

        event.changedTouches.forEach((touch) => {
            const index = this.ongoingTouchIndexById(touch.identifier);
            this._onGoingTouches.splice(index, 1); // eslint-disable-line no-magic-numbers
        });
    }

    handleTouchCancel (event) {
        event.preventDefault();
        if (!event.changedTouches) {
            const index = this.ongoingTouchIndexById(event.pointerId);
            this._onGoingTouches.splice(index, 1); // eslint-disable-line no-magic-numbers
            return;
        }

        event.changedTouches.forEach((touch) => {
            const index = this.ongoingTouchIndexById(touch.identifier);
            this._onGoingTouches.splice(index, 1); // eslint-disable-line no-magic-numbers
        });
    }

    handleTouchMove (event) {
        event.preventDefault();
        if (event.changedTouches) {
            event.changedTouches.forEach((touch) => {
                const index = this.ongoingTouchIndexById(touch.identifier);
                if (index > -1) this._onGoingTouches.splice(index, 1, this.copyTouch(touch)); // eslint-disable-line no-magic-numbers
            });
        }
        else {
            const index = this.ongoingTouchIndexById(event.pointerId);
            if (index > -1) this._onGoingTouches.splice(index, 1, this.copyTouch(event)); // eslint-disable-line no-magic-numbers
        }
    }

    copyTouch (touch) {
        const identifier = touch.pointerId ? touch.pointerId : touch.identifier;
        const { pageX, pageY } = touch;
        return { identifier, pageX, pageY };
    }

    ongoingTouchIndexById (idToFind) {
        return this._onGoingTouches.findIndex((touch) => touch.identifier === idToFind);
    }

    getTouches () {
        return this._onGoingTouches;
    }

}
