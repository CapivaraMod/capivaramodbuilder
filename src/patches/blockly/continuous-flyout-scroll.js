
export default (ContinuousFlyout) => {
    if (!ContinuousFlyout) return;

    ContinuousFlyout.prototype.scrollTo = function (position) {
        const metrics = this.workspace_.getMetrics();

        const maxScroll = Math.max(0, metrics.scrollHeight - metrics.viewHeight);
        this.scrollTarget = Math.min(
            Math.max(position * this.workspace_.scale, 0),
            maxScroll
        );


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