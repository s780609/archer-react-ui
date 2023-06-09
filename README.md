# archer-react-ui
一些不容易看到的UI，自己做好推上來

## SpecialCharacterKeyboard
原住民族語特殊符號鍵盤

### API   
|  name   | type  | description |  
|  ----  | ----  | ---- |
| onClick | callback function | 會把focus到的目標(input或是textarea)的 DOM element 和 value 附上 event arg 事件參數物件 |

example:
```javascript
import { SpecialCharacterKeyboard } from "archer-react-ui"

// ...
// ...

return <>
    <SpecialCharacterKeyboard onClick={(e)=>{
        // 📌 targetElement是目標DOM element
        console.log(e.targetElement);
        
        // 📌 value 是當下的DOM元素的值
        console.log(e.value);
    }}></SpecialCharacterKeyboard>
</>
```

## Recorder
網頁用錄音器
|  name   | type  | description |  
|  ----  | ----  | ---- |
| onClose | callback function | 參數是錄完音的 `blob url` |

```javascript
import { Recorder } from "archer-react-ui";

// ...
// ...

return <>
    <Recorder onClose={(audioBlobUrl)=>{
        console.log(audioBlobUrl);
    }}></Recorder>
</>
```
