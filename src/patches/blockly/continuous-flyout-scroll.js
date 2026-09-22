// Fix for @blockly/continuous-toolbox v3.0.17:
// Clicking categories rapidly stacks multiple concurrent
// requestAnimationFrame scroll loops (scrollTo never cancels the
// previous one), which fight over the scroll position and leave
// `scrollTarget` "stuck" set. While it's set, selectCategoryByScrollPosition_
// ignores manual scrolling (wheel / scrollbar drag), so the flyout appears
// to stop scrolling entirely.
//
// Fix: cancel any in-flight animation frame before starting a new one,
// use `null` (not falsy-0) to represent "no target" AND "no frame",
// clamp the target to a valid range (never negative), and stop the
// loop safely if the workspace gets disposed mid-animation.
export default (ContinuousFlyout) => {
    if (!ContinuousFlyout) return;

    ContinuousFlyout.prototype.scrollTo = function (position) {
        const metrics = this.workspace_.getMetrics();

        // Clamp to [0, maxScroll] — without the lower bound, flyouts whose
        // content is shorter than the viewport (scrollHeight < viewHeight)
        // produce a negative target and scroll past the top unnecessarily.
        const maxScroll = Math.max(0, metrics.scrollHeight - metrics.viewHeight);
        this.scrollTarget = Math.min(
            Math.max(position * this.workspace_.scale, 0),
            maxScroll
        );

        // Cancel any previous animation loop so only the most recent
        // category click drives the scroll. Use `!= null` consistently
        // (not truthy checks) since a valid rAF id could theoretically be 0.
        if (this._scrollAnimationFrame != null) {
            cancelAnimationFrame(this._scrollAnimationFrame);
            this._scrollAnimationFrame = null;
        }

        this.stepScrollAnimation_();
    };

    ContinuousFlyout.prototype.stepScrollAnimation_ = function () {
        if (this.scrollTarget == null) {
            return;
        }

        // Guard against the workspace having been disposed (e.g. the
        // toolbox/category was closed) while a scroll animation was still
        // in flight. Without this, the next queued frame throws trying to
        // read metrics or set scroll position on a dead workspace.
        if (!this.workspace_ || this.workspace_.disposed) {
            this.scrollTarget = null;
            this._scrollAnimationFrame = null;
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