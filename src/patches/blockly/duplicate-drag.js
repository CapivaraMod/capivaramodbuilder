

/**
 * @argument {import("blockly/core")} Blockly
 */
export default function (Blockly) {
    Blockly.Connection.REASON_DRAG_DUPLICATE = 9

    const doSafetyChecks = Blockly.ConnectionChecker.prototype.doSafetyChecks
    /**
     * @type {typeof doSafetyChecks}
     */
    Blockly.ConnectionChecker.prototype.doSafetyChecks = function (a, b) {
        let actual = doSafetyChecks.call(this, a, b)

        if (actual !== Blockly.Connection.CAN_CONNECT) return actual

        if (
            (a.targetConnection && a.targetConnection.sourceBlock_ && a.targetConnection.sourceBlock_.canDragDuplicate()) ||
            (b.targetConnection && b.targetConnection.sourceBlock_ && b.targetConnection.sourceBlock_.canDragDuplicate())
        ) {
            return Blockly.Connection.REASON_DRAG_DUPLICATE
        }

        return actual
    }

    for (let Block of [Blockly.Block, Blockly.BlockSvg]) {
        Block.prototype.canDragDuplicate_ = false

        Block.prototype.canDragDuplicate = function() {
            return this.canDragDuplicate_ && this.isShadow()
        }

        /**
         * @param {boolean} value 
         */
        Block.prototype.setDragDuplicate = function(value) {
            this.canDragDuplicate_ = value
        }

        const jsonInit = Block.prototype.jsonInit
        /**
         * @type {typeof jsonInit}
         */
        Block.prototype.jsonInit = function(json) {
            jsonInit.call(this, json)

            if (json['canDragDuplicate'] !== undefined) {
                this.setDragDuplicate(json['canDragDuplicate']);
            }
        }
    }

    Blockly.Gesture.prototype.shouldDuplicateOnDrag_ = false

    const setStartBlock = Blockly.Gesture.prototype.setStartBlock
    /**
     * @type {typeof setStartBlock}
     */
    Blockly.Gesture.prototype.setStartBlock = function(block) {
        if (!this.startBlock_ && !this.startBubble_) {
            this.shouldDuplicateOnDrag_ = block.canDragDuplicate()
        }

        return setStartBlock.call(this, block)
    }

    const updateIsDraggingBlock_ = Blockly.Gesture.prototype.updateIsDraggingBlock_
    /**
     * @type {typeof updateIsDraggingBlock_}
     */
    Blockly.Gesture.prototype.updateIsDraggingBlock_ = function() {
        if (this.targetBlock_ && !this.flyout_ && this.shouldDuplicateOnDrag_) {
            this.startDraggingBlock_();
            return true
        }

        return updateIsDraggingBlock_.call(this)
    }

    const startDraggingBlock_ = Blockly.Gesture.prototype.startDraggingBlock_
    /**
     * @type {typeof startDraggingBlock_}
     */
    Blockly.Gesture.prototype.startDraggingBlock_ = function() {
        if (this.shouldDuplicateOnDrag_ && !this.flyout_) {
            this.duplicateOnDrag_()
        }
        
        return startDraggingBlock_.call(this)
    }

    Blockly.Gesture.prototype.duplicateOnDrag_ = function () {
        var newBlock = null;
        Blockly.Events.disable();
        try {
            this.startWorkspace_.setResizesEnabled(false);
            var xmlBlock = Blockly.Xml.blockToDom(this.targetBlock_);
            newBlock = Blockly.Xml.domToBlock(xmlBlock, this.startWorkspace_);

            var xy = this.targetBlock_.getRelativeToSurfaceXY();
            newBlock.moveBy(xy.x, xy.y);
            newBlock.setShadow(false);
            newBlock.initSvg();
            newBlock.render();
        } finally {
            Blockly.Events.enable();
        }
        if (!newBlock) {
            // Something went wrong.
            console.error('Something went wrong while duplicating a block.');
            return;
        }
        if (Blockly.Events.isEnabled()) {
            Blockly.Events.fire(new Blockly.Events.BlockCreate(newBlock));
        }
        newBlock.select();
        this.targetBlock_ = newBlock;
    };

    Blockly.Gesture.prototype.setTargetBlock_ = function(block) {
        if (block.isShadow() && !this.shouldDuplicateOnDrag_) {
          this.setTargetBlock_(block.getParent());
        } else {
          this.targetBlock_ = block;
        }
    };
}