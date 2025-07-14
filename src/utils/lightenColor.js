export const lightenColor = (hex, percent) => {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    r = parseInt(r * (100 + percent) / 100);
    g = parseInt(g * (100 + percent) / 100);
    b = parseInt(b * (100 + percent) / 100);

    r = (r < 255) ? r : 255;
    g = (g < 255) ? g : 255;
    b = (b < 255) ? b : 255;

    const rr = (r.toString(16).length === 1) ? "0" + r.toString(16) : r.toString(16);
    const gg = (g.toString(16).length === 1) ? "0" + g.toString(16) : g.toString(16);
    const bb = (b.toString(16).length === 1) ? "0" + b.toString(16) : b.toString(16);

    return `#${rr}${gg}${bb}`;
};