import Konva from "konva";

/**
 * Utility class for debuing bounding boxxes
 */
export class DebugBoundingBoxViewer {
    private boundingBoxRect: Konva.Rect;
    private visible: boolean = false;

    /**
     * Create a debug bounding box for an entity
     * @param group Konva Group for entitiy/image 
     */
    constructor(group: Konva.Group) {
        this.boundingBoxRect = new Konva.Rect({
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            stroke: 'red',
            strokeWidth: 1,
            visible: false,
        });
        group.add(this.boundingBoxRect);
    }

    /**
     * Toggle visibility of the bounding box
     */
    public toggleVisibility(show: boolean) {
        this.visible = show;
        this.boundingBoxRect.visible(show);
    }

    /**
     * Update bounding box with new frame/position
     */
    public updateBox(box: { x: number; y: number; width: number; height: number } | null) {
        if (!this.visible || !box) {
            this.boundingBoxRect.visible(false);
            return;
        }

        this.boundingBoxRect.x(box.x);
        this.boundingBoxRect.y(box.y);
        this.boundingBoxRect.width(box.width);
        this.boundingBoxRect.height(box.height);
        this.boundingBoxRect.visible(true);
    }

    /**
     * Delete Bounding Box
     */
    public destroy() {
        this.boundingBoxRect.destroy();
    }
}