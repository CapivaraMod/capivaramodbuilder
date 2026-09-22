// Fix for @blockly/continuous-toolbox v3.0.17:
// Clicking categories rapidly stacks multiple concurrent
// requestAnimationFrame scroll loops (scrollTo never cancels the
// previous one), which fight over the scroll position and leave
// `scrollTarget` "stuck" set. While it's set, selectCategoryByScrollPosition_
// ignores manual scrolling (wheel / scrollbar drag), so the flyout appears
// to stop scrolling entirely.
//
// Fix: cancel any in-flight animation frame before starting a new one,
// and use `null` (not falsy-0) to represent "no target".
export default (ContinuousFlyout) => {
    if (!ContinuousFlyout) return;

    ContinuousFlyout.prototype.scrollTo = function (position) {
        const metrics = this.workspace_.getMetrics();
        this.scrollTarget = Math.min(
            position * this.workspace_.scale,
            metrics.scrollHeight - metrics.viewHeight
        );

        // Cancel any previous animation loop so only the most recent
        // category click drives the scroll.
        if (this._scrollAnimationFrame) {
            cancelAnimationFrame(this._scrollAnimationFrame);
            this._scrollAnimationFrame = null;
        }

        this.stepScrollAnimation_();
    };

    ContinuousFlyout.prototype.stepScrollAnimation_ = function () {
        if (this.scrollTarget === null || this.scrollTarget === undefined) {
            return;
        }

        const currentScrollPos = -this.workspace_.scrollY;
        const diff = this.scrollTarget - currentScrollPos;
        if (Math.abs(diff) < 1) {
            this.workspace_.scrollbar.setY(this.scrollTarget);
            this.scrollTarget = null;
            this._scrollAnimationFrame = null;
            return;
        }
        this.workspace_.scrollbar.setY(
            currentScrollPos + diff * this.scrollAnimationFraction
        );

        this._scrollAnimationFrame = requestAnimationFrame(
            this.stepScrollAnimation_.bind(this)
        );
    };
};