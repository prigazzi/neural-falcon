class Visualizer {
    static drawNetwork(ctx, network) {
        const margin = 50;
        const left = margin;
        const top = margin;
        const width = ctx.canvas.width - (margin * 2);
        const height = ctx.canvas.height - (margin * 2)

        Visualizer.drawLevel(ctx, network.levels[0], left, top, width, height);
    }

    static drawLevel(ctx, level, left, top, width, height) {
        const right = left + width;
        const bottom = top + height;
        const {inputs, outputs, weights, biases} = level;

        const nodeRadius = 12;

        // Weights
        for (let i = 0; i < inputs.length; i++) {
            for (let j = 0; j < outputs.length; j++) {
                ctx.beginPath();
                ctx.moveTo(
                    Visualizer.#getNodeX(inputs.length, i, left, right),
                    bottom
                );
                ctx.lineTo(
                    Visualizer.#getNodeX(outputs.length, j, left, right),
                    top
                );

                ctx.strokeStyle = getRGBA(weights[i][j]);
                ctx.stroke();
            }
        }

        // Input Nodes
        for (let i = 0; i < inputs.length; i++) {
            const x = Visualizer.#getNodeX(inputs.length, i, left, right);

            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius * 0.7, 0, Math.PI*2);
            ctx.fillStyle = getRGBA(inputs[i]);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius, 0, Math.PI*2);
            ctx.lineWidth = 2;
            ctx.strokeStyle = getRGBA(inputs[i]);
            ctx.stroke();
        }

        // Output Nodes
        for (let i = 0; i < outputs.length; i++) {
            const x = Visualizer.#getNodeX(outputs.length, i, left, right);

            ctx.beginPath();
            ctx.arc(x, top, nodeRadius * 0.7, 0, Math.PI*2);
            ctx.fillStyle = getRGBA(outputs[i]);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, top, nodeRadius, 0, Math.PI*2);
            ctx.lineWidth = 2;
            ctx.strokeStyle = getRGBA(biases[i]);
            ctx.setLineDash([5, 5]);
            ctx.stroke();
        }
    }

    static #getNodeX(nodesLength, index, left, right) {
        return lerp(
            left,
            right,
            nodesLength == 1
                ? 0.5
                : index / (nodesLength - 1)
        )
    }
}
