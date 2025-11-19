/**
 * Computer a tight Bounding box for a single frame inside an image
 * this is done throught putting the frame into an offscreen canvas
 * then looking at the pixel data for non transparent pixels
 * and returning the tightest bounding box around them
 * @param image wizard/knight images
 * @param frame the frame inside the imageatlas
 * @param alphaThreshold opaque threshold
 * @param padding //extra pixels around bounding box (probly not use)
 */
export function computeTightBoundingBoxForFrame(
    image: HTMLImageElement,
    frame: { x: number; y: number; width: number; height: number },
    alphaThreshold = 1,
    padding = 0
): { x: number; y: number; width: number; height: number } {
    //create offscreen canvas to draw frame
    const canvas = document.createElement("canvas");
    //size of frame
    canvas.width = frame.width;
    canvas.height = frame.height;
    const ctx = canvas.getContext("2d");
    
    //return nothing if no default bounding box since get context returns null
    if (!ctx) return { x: 0, y: 0, width: 0, height: 0 };
    //clear working offscreen canvas from previous
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //draw animation frame
    ctx.drawImage(image, frame.x, frame.y, frame.width, frame.height, 0, 0, frame.width, frame.height);
    const imgData = ctx.getImageData(0, 0, frame.width, frame.height);
    
    //gives array of RGBA pixels e.g 32*32*4 = 4096 1D array of RGBA
    const data = imgData.data;

    const BYTES_PER_PIXEL = 4; //RGBA
    const ALPHA_OFFSET = 3; // opacity position

    //base values to shrink the bounding box
    let minX = frame.width, minY = frame.height, maxX = -1, maxY = -1;

    // helper function grabs alpha at x,y
    const getAlphaAt = (x: number, y: number) => {
        const rowStart = y * frame.width * BYTES_PER_PIXEL;
        return data[rowStart + x * BYTES_PER_PIXEL + ALPHA_OFFSET];
    };

    // heavy computation but it runs once per image load and results are cached
    for (let y = 0; y < frame.height; y++) {
        for (let x = 0; x < frame.width; x++) {
            const a = getAlphaAt(x, y);
            if (a > alphaThreshold) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            }
        }
    }

    //add padding and match pixelart bounds
    minX = Math.max(0, minX - padding);
    minY = Math.max(0, minY - padding);
    maxX = Math.min(frame.width - 1, maxX + padding);
    maxY = Math.min(frame.height - 1, maxY + padding);

    return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

/**
 * computers a tight pixel perfect boudning boxes for every frame in each animation
 * and caches them. Runs once image load. make offscreen and read pixel alpha
 * this is a preprocessing step
 * @param image image atlas
 */
export function computeAllAnimationBoundingBoxes(
    image: HTMLImageElement,
    animations: Record<string, number[]>,
    alphaThreshold = 1,
    padding = 0

): Record<string, { x: number; y: number; width: number; height: number }[]> {
    //string "walk" , [x, y, width, height]
    const out: Record<string, { x: number; y: number; width: number; height: number }[]> = {};

    for (const key of Object.keys(animations)) {
        const arr = animations[key];
        const frames: { x: number; y: number; width: number; height: number }[] = [];
        //for each frame in animation add by 4 for x,y,width,height
        for (let i = 0; i < arr.length; i += 4) {
            //[x, y, width, height]
            const frame = { x: arr[i], y: arr[i + 1], width: arr[i + 2], height: arr[i + 3] };
            //compute tight bounding box for frame
            frames.push(computeTightBoundingBoxForFrame(image, frame, alphaThreshold, padding));
        }
        out[key] = frames;
    }
    return out;
}
