import { ByteArray, ShortString, compress, decompress } from '../src/core';

describe('byteArray.toShortString - core', () => {
    it('should convert byte array to short string', () => {
        const arr = new Uint8Array([1]);
        const str = ByteArray.toShortString(arr);
        expect(str).toStrictEqual('!');
    });
});

describe('shortStringToByteArray - core', () => {
    it('should convert short string to byte array', () => {
        const str = '!';
        const arr = ShortString.toByteArray(str);
        expect(arr).toStrictEqual(new Uint8Array([1]));
    });
});

describe('compress - core', () => {
    it('should not shorten an already short string', () => {
        const str = 'This is a long string with lots of characters.';
        const compressed = compress(str);
        expect(compressed).toStrictEqual(str);
    });
});

describe('compress/decompress - core', () => {
    it('should shorten a big stringified JSON', () => {
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
        const decompressed = decompress(compressed);

        // eslint-disable-next-line max-len
        expect(str).toStrictEqual(decompressed);
    });
})
