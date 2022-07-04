function lerp (A, B, t) {
    return A + (B - A) * t;
}

function getIntersectionBetween(S1, S2) {
    let A = S1[0], B = S1[1], C = S2[0], D = S2[1];
    const tTop = (D.x-C.x)*(A.y-C.y)-(D.y-C.y)*(A.x-C.x);
    const uTop = (C.y-A.y)*(A.x-B.x)-(C.x-A.x)*(A.y-B.y);
    const bottom = (D.y-C.y)*(B.x-A.x)-(D.x-C.x)*(B.y-A.y);

    if (bottom != 0) {
        const t = tTop/bottom;
        const u = uTop/bottom;

        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t
            }
        }
    }
}

function polysIntersect(A, B) {
    for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < B.length; j++) {
            const touch = getIntersectionBetween(
                [A[i], A[(i+1) % A.length]],
                [B[j], B[(j+1) % B.length]]
            );

            if(touch) {
                return true;
            }
        }
    }

    return false;
}

function getRGBA(value) {
    const alpha = Math.abs(value);
    const R = value < 0 ? 255 : 0;
    const G = value <  0 ? 0: 255;
    const B = 0;
    return `rgba(${R}, ${G}, ${B}, ${alpha})`;
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
