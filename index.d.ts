// LICENSE is MIT
//
// Copyright (c) 2023
//

import React from "react";

export default interface JazzAvatar {
    getSvg(size: number, seed: number): SVGSVGElement;
    getSvgBase64(size: number, seed: number): string;
    getSvgEl(): React.ReactSVGElement
}

