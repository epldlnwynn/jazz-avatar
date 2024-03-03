# jazz-avatar
Jazzy deterministic identicons for a more entertaining future.

![example](./example.png)

## Installation

---

```shell

npm i jazz-avatar -S

# or 

yarn add jazz-avatar

```



## Usage

--- 

```typescript
import jazzAvatar from "jazz-avatar";


// 使用base64方式
const base64 = jazzAvatar.getSvgBase64(100, seed || 0)
<img src={base64} />


// 创建 svg 
const svgEl = jazzAvatar.getSvg(100, seed || 0)
document.body.appendChild(svgEl)


// React 节点
export default ({ size, seed}: {size:number; seed?: number}) => {
    return jazzAvatar.getSvgEl(size, seed || 0)
}


```


