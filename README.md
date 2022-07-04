# minie
    Yet another simple string compressor

# Get started
```js
import { compress, decompress } from 'minie';

const str = JSON.stringify({
            widget: {
                debug: 'on',
                window: {
                    title: 'Sample Konfabulator Widget',
                    name: 'main_window',
                    width: 500,
                    height: 500,
                },
                image: {
                    src: 'Images/Sun.png',
                    name: 'sun1',
                    hOffset: 250,
                    vOffset: 250,
                    alignment: 'center',
                },
                text: {
                    data: 'Click Here',
                    size: 36,
                    style: 'bold',
                    name: 'text1',
                    hOffset: 250,
                    vOffset: 100,
                    alignment: 'center',
                    onMouseUp: 'sun1.opacity = (sun1.opacity / 100) * 90;',
                },
            },
        });

const compressed = compress(str);
// => '🐈BÐ* sďć§#$ÂÕdn$T3ÊńmÝØmüm&z_¾tg_7ĶKĞĒ±YÝoÛp§òĐŃ¼Jûs,ħL¾Ø¾ĤàĎ%~ð0IíJĕĝ©$X%#Ďªė¦~ďĎIÌ\x7FģKb[7rÆ]Ě©ìu;ĊĠģOÆÙR`\x81|¿b{-fìAįºxlĭĖßã¨{đ5ñzËŀJÍ¨ĐûČEĨ·Ø®TÕ\\ħ§ë8ðŃêİ§ÞĶ·ĒéĔ6êáXĩÖ{fĐ)ÓąŁÉ¤ŀÚwuŁµĴ±ŀDAµgëhŀĒıð°ăêĢĴ«pµĿ;}āńéóďYÄémŃüĬÕFă1ÌĎ:¦sòp^¶JēqĹuSĩ\x7F\x7FÍàį9ī¾Ń!ęöć-Ê!  '

const decompressed = JSON.parse(decompress(compressed));
/*
  => {
        widget: {
            debug: 'on',
            window: {
                title: 'Sample Konfabulator Widget',
                name: 'main_window',
                width: 500,
                height: 500,
            },
            image: {
                src: 'Images/Sun.png',
                name: 'sun1',
                hOffset: 250,
                vOffset: 250,
                alignment: 'center',
            },
            text: {
                data: 'Click Here',
                size: 36,
                style: 'bold',
                name: 'text1',
                hOffset: 250,
                vOffset: 100,
                alignment: 'center',
                onMouseUp: 'sun1.opacity = (sun1.opacity / 100) * 90;',
            },
        },
    }
*/


// That's about it.
```
