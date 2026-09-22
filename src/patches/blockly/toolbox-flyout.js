export default (Blockly, config, workspace) => {
    // patch Blockly to fix zooming with the toolbox
    Blockly.VerticalFlyout.prototype.getFlyoutScale = function () {
        return config.zoom.startScale;
    };

    Blockly.VerticalFlyout.prototype.reflowInternal_ = function () {
        this.workspace_.scale = this.getFlyoutScale();
        let flyoutWidth = 0;
        const blocks = this.workspace_.getTopBlocks(false);
        for (let i = 0, block; (block = blocks[i]); i++) {
            let width = block.getHeightWidth().width;
            if (block.outputConnection) {
                width -= this.tabWidth_;
            }
            flyoutWidth = Math.max(flyoutWidth, width);
        }
        for (let i = 0, button; (button = this.buttons_[i]); i++) {
            flyoutWidth = Math.max(flyoutWidth, button.width);
        }
        flyoutWidth += this.MARGIN * 1.5 + this.tabWidth_;
        flyoutWidth *= this.workspace_.scale;
        flyoutWidth += Blockly.Scrollbar.scrollbarThickness;

        flyoutWidth = Math.min(
            flyoutWidth,
            320
        );

        if (this.width_ !== flyoutWidth) {
            for (let i = 0, block; (block = blocks[i]); i++) {
                if (this.rectMap_.has(block)) {
                    this.moveRectToBlock_(this.rectMap_.get(block), block);
                }
            }

            if (this.targetWorkspace.toolboxPosition === this.toolboxPosition_ &&
                this.toolboxPosition_ === Blockly.utils.toolbox.Position.LEFT &&
                !this.targetWorkspace.getToolbox()) {
                // This flyout is a simple toolbox. Reposition the workspace so that
                // (0,0) is in the correct position relative to the new absolute edge
                // (ie toolbox edge).
                this.targetWorkspace.translate(
                    this.targetWorkspace.scrollX + flyoutWidth,
                    this.targetWorkspace.scrollY
                );
            }

            this.width_ = flyoutWidth;
            this.position();
            this.targetWorkspace.resizeContents();
            this.targetWorkspace.recordDragTargets();
        }
    };

    const Svg = Blockly.utils.Svg
    const dom = Blockly.utils.dom
    const parsing = Blockly.utils.parsing
    const style = Blockly.utils.style
    Blockly.FlyoutButton.prototype.createDom = function () {
        let cssClass = this.isLabel_ ? 'blocklyFlyoutLabel' : 'blocklyFlyoutButton';
        if (this.cssClass_) {
          cssClass += ' ' + this.cssClass_;
        }
    
        this.svgGroup_ = dom.createSvgElement(
            Svg.G, {'class': cssClass}, this.workspace.getCanvas());

        // Background rectangle.
        const rect = dom.createSvgElement(
            Svg.RECT, {
              'class': this.isLabel_ ? 'blocklyFlyoutLabelBackground' :
                                       'blocklyFlyoutButtonBackground',
              'rx': Blockly.FlyoutButton.BORDER_RADIUS,
              'ry': Blockly.FlyoutButton.BORDER_RADIUS,
            },
            this.svgGroup_);
    
        const svgText = dom.createSvgElement(
            Svg.TEXT, {
              'class': this.isLabel_ ? 'blocklyFlyoutLabelText' : 'blocklyText',
              'x': 0,
              'y': 0,
              'text-anchor': 'middle',
            },
            this.svgGroup_);
        let text = parsing.replaceMessageReferences(this.text_);
        if (this.workspace.RTL) {
          // Force text to be RTL by adding an RLM.
          text += '\u200F';
        }
        svgText.textContent = text;
        if (this.isLabel_) {
          this.svgText_ = svgText;
          this.workspace.getThemeManager().subscribe(
              this.svgText_, 'flyoutForegroundColour', 'fill');
        }
    
        const fontSize = style.getComputedStyle(svgText, 'fontSize');
        const fontWeight = style.getComputedStyle(svgText, 'fontWeight');
        const fontFamily = style.getComputedStyle(svgText, 'fontFamily');
        this.width = dom.getFastTextWidthWithSizeString(
            svgText, fontSize, fontWeight, fontFamily);
        const fontMetrics =
            dom.measureFontMetrics(text, fontSize, fontWeight, fontFamily);
        this.height = fontMetrics.height;
    
        if (!this.isLabel_) {
          this.width += 4 * Blockly.FlyoutButton.TEXT_MARGIN_X;
          this.height += 6 * Blockly.FlyoutButton.TEXT_MARGIN_Y;
        }
        rect.setAttribute('width', String(this.width));
        rect.setAttribute('height', String(this.height));
    
        svgText.setAttribute('x', String(this.width / 2));
        svgText.setAttribute(
            'y',
            String(
                this.height / 2 - fontMetrics.height / 2 + fontMetrics.baseline));
    
        this.updateTransform_();
    
        // AnyDuringMigration because:  Argument of type 'SVGGElement | null' is not
        // assignable to parameter of type 'EventTarget'.
        this.onMouseUpWrapper_ = Blockly.browserEvents.conditionalBind(
            this.svgGroup_, 'pointerup', this,
            this.onMouseUp_);
        return this.svgGroup_;
      }
};