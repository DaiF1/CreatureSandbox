
export function degToRad(d: number) {
    return d * Math.PI / 180;
}

export function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function componentToHex(c: number) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

export function rgbToHex(r: number, g: number, b: number) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function invertColor(hex: string) {
  let c = hexToRgb(hex);
  return rgbToHex(255 - c!.r, 255 - c!.g, 255 - c!.b);
}

export function darkenColor(hex: string, amount: number) {
  let c = hexToRgb(hex);

  return rgbToHex(Math.max(0, c!.r - amount),
                  Math.max(0, c!.g - amount),
                  Math.max(0, c!.b - amount));
}
