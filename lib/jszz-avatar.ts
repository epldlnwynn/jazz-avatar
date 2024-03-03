import React from "react";

const MersenneTwister = require('mersenne-twister');
const shapeCount = 4, wobble = 30, xmlns = 'http://www.w3.org/2000/svg'

const colors = [
    '#01888C', // teal
    '#FC7500', // bright orange
    '#034F5D', // dark teal
    '#F73F01', // orangered
    '#FC1960', // magenta
    '#C7144C', // raspberry
    '#F3C100', // goldenrod
    '#1598F2', // lightning blue
    '#2465E1', // sail blue
    '#F19E02', // gold
]


var generator: any;
function generateSvgIcon(size: number, seed: number) {
    generator = new MersenneTwister(seed);
    var remainingColors = hueShift(colors.slice(), generator)

    var svg = document.createElementNS(xmlns, 'svg')
    svg.setAttribute("xmlns", xmlns)
    svg.setAttribute('x', '0')
    svg.setAttribute('y', '0')
    svg.setAttribute('width', size.toString())
    svg.setAttribute('height', size.toString())

    // @ts-ignore
    svg.style.backgroundColor = genColor(remainingColors);

    for(var i = 0; i < shapeCount - 1; i++) {
        genShape(remainingColors, size, i, shapeCount - 1, svg)
    }

    return svg
}
function generateSvgBase64(size: number, seed: number) {
    var svg = generateSvgIcon(size, seed)
    return "data:image/svg+xml;base64," + base64(svg.outerHTML)
}
function generateSvgEl(size: number, seed: number) {
    generator = new MersenneTwister(seed);
    var remainingColors = hueShift(colors.slice(), generator)
    const rects: any = [];
    const options: any = {
        x: 0, y: 0,
        //width: size, height: size,
        role: 'jazzicon',
    }

    for(var i = 0; i < shapeCount - 1; i++) {
        const rect = genShape(remainingColors, size, i, shapeCount - 1)
        rects.push(rect)
    }

    return React.createElement("svg", options, rects);
}


function genShape(remainingColors: any, diameter: number, i: any, total: any, svg?: any) {
    var center = diameter / 2, shape

    var firstRot = generator.random()
    var angle = Math.PI * 2 * firstRot
    var velocity = diameter / total * generator.random() + (i * diameter / total)

    var tx = (Math.cos(angle) * velocity)
    var ty = (Math.sin(angle) * velocity)

    var translate = 'translate(' + tx + ' ' +  ty + ')'

    // Third random is a shape rotation on top of all of that.
    var secondRot = generator.random()
    var rot = (firstRot * 360) + secondRot * 180
    var rotate = 'rotate(' + rot.toFixed(1) + ' ' + center + ' ' + center + ')'
    var transform = translate + ' ' + rotate
    var fill = genColor(remainingColors)

    if (svg) {
        shape = document.createElementNS(xmlns, 'rect')
        shape.setAttribute("x", "0")
        shape.setAttribute("y", "0")
        shape.setAttribute("transform", translate)
        shape.setAttribute("fill", fill)
        shape.setAttribute('width', diameter.toString())
        shape.setAttribute('height', diameter.toString())
        svg.appendChild(shape)
    } else {
        shape = React.createElement("rect", {
            x: 0, y: 0,
            //width: diameter, height: diameter,
            transform: transform,
            fill: fill,
        })
    }

    return shape
}

function genColor(colors: any) {
    var rand = generator.random()
    var idx = Math.floor(colors.length * rand)
    var color = colors.splice(idx, 1)[0]
    return color
}


function hueShift(colors: Array<string>, generator: any) {
    var amount = (generator.random() * 30) - (wobble / 2)
    var rotate = (hex: any) => colorRotate(hex, amount)
    return colors.map(rotate)
}

function colorRotate(hex: any, degrees: number) {
    var hsl = hexToHSL(hex)
    var hue = hsl.h
    hue = (hue + degrees) % 360;
    hue = hue < 0 ? 360 + hue : hue;
    hsl.h = hue;
    return HSLToHex(hsl);
}

function hexToHSL(hex: string) {
    // Convert hex to RGB first
    var r:any = "0x" + hex[1] + hex[2];
    var g:any = "0x" + hex[3] + hex[4];
    var b:any = "0x" + hex[5] + hex[6];
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    var cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    if (delta == 0)
        h = 0;
    else if (cmax == r)
        h = ((g - b) / delta) % 6;
    else if (cmax == g)
        h = (b - r) / delta + 2;
    else
        h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0)
        h += 360;

    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return {h, s, l}
}

function HSLToHex(hsl: any) {
    var {h, s, l} = hsl
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c/2,
        r:any = 0 ,
        g:any = 0,
        b:any = 0;

    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }
    // Having obtained RGB, convert channels to hex
    r = Math.round((r + m) * 255).toString(16);
    g = Math.round((g + m) * 255).toString(16);
    b = Math.round((b + m) * 255).toString(16);

    // Prepend 0s, if necessary
    if (r.length == 1)
        r = "0" + r;
    if (g.length == 1)
        g = "0" + g;
    if (b.length == 1)
        b = "0" + b;

    return "#" + r + g + b;
}

function base64(s: string){
    if ("btoa" in window)
        return window.btoa(s);

    const ch = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var c1, c2, c3, e1, e2, e3, e4;
    var l = s.length, i = 0, r = "";

    do {
        c1 = s.charCodeAt(i);
        e1 = c1 >> 2;
        c2 = s.charCodeAt(i+1);
        e2 = ((c1 & 3) << 4) | (c2 >> 4);
        c3 = s.charCodeAt(i+2);
        if (l < i+2) { e3 = 64; } else { e3 = ((c2 & 0xf) << 2) | (c3 >> 6); }
        if (l < i+3) { e4 = 64; } else { e4 = c3 & 0x3f; }
        r += ch.charAt(e1) + ch.charAt(e2) + ch.charAt(e3) + ch.charAt(e4);
    } while ((i += 3) < l);
    return r;
};


export default {
    getSvg: generateSvgIcon,
    getSvgEl: generateSvgEl,
    getSvgBase64: generateSvgBase64,
}
