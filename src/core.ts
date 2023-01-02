import { GzipOptions, compressSync, decompressSync } from 'fflate';
import { MINIE_SHORT_PREFIX, MINIE_SHORT_SUFFIX, MINIE_UID_PREFIX_LENGTH } from './consts';
import { ReallyAny } from './types';

export const Text = {
    toByteArray(str: string): Uint8Array {
        return new Uint8Array(Buffer.from(str, 'utf-8'));
    },
    countBytes(str: string): number {
        return Buffer.byteLength(str, 'utf-8');
    },
};

export const ShortString = {
    toByteArray(str: string): Uint8Array {
        // return new TextEncoder().encode(str);
        return new Uint8Array(Array.from(str).map((c) => CharCode.toByte(c.charCodeAt(0))));
    },
};

export const CharCode = {
    toByte(i: number) {
        // Decided not to fiddle with the bytes, because it's not worth it. Or is it?
        return i;
        // eslint-disable-next-line no-nested-ternary
        // return i - (i > 63743 ? 8517 : i > 159 ? 69 : i > 46 && i < 130 ? 35 : i > 40 && i < 46 ? 34 : i > 34 && i < 40 ? 33 : 32);
    },
    random() {
        return Byte.toChar(Math.floor(Math.random() * 127));
    },
};

export const Byte = {
    toCharCode(i: number): number {
        // Decided not to fiddle with the bytes, because it's not worth it. Or is it?

        return i;

        // i += 32;

        // if (i > 33 && i < 39) {
        //     i++;
        // } else if (i > 38 && i < 44) {
        //     i += 2;
        // } else if (i > 43 && i < 127) {
        //     i += 3;
        // } else if (i > 126 && i < 55258) {
        //     i += 37; // === 160 - 128 + 3
        // } else if (i > 55295) {
        //     i += 8485; // === 63744 - 55296 + 37
        // }
        // return i;
    },
    toChar(i: number): string {
        return String.fromCharCode(Byte.toCharCode(i));
    },
};

export const ByteArray = {
    toShortString: (data: Uint8Array): string => {
        return Array.from(data).map((x) => Byte.toChar(x)).join('');
    },
    toString(data: Uint8Array): string {
        return Buffer.from(data).toString();
    },
};

export const isCompressed = (value: ReallyAny): boolean => {
    return (typeof value === 'string' && value.startsWith(MINIE_SHORT_PREFIX) && value.endsWith(MINIE_SHORT_SUFFIX));
};

export const hasCompressed = (value: ReallyAny): boolean => {
    return (typeof value === 'string' && value.includes(MINIE_SHORT_PREFIX) && value.includes(MINIE_SHORT_SUFFIX));
};

export const compressRaw = (str: string, opts: GzipOptions = { level: 9, mem: 6 }): Uint8Array => {
    const arr = Text.toByteArray(str);
    return compressSync(arr, opts);
};

export const compress = (str: string, opts: GzipOptions = { level: 9, mem: 6 }): string => {
    const uintArray = compressRaw(str, opts);
    const compressed = ByteArray.toShortString(uintArray);

    if (str.length <= compressed.length) return str;
    // Make sure the uid is unique and of the right length
    const uid = CharCode.random().slice(0, MINIE_UID_PREFIX_LENGTH);
    const decorated = `${MINIE_SHORT_PREFIX}${uid}${compressed}${MINIE_SHORT_SUFFIX}`;

    const isSmallerThanOriginal = Text.countBytes(decorated) < Text.countBytes(str);
    return isSmallerThanOriginal ? decorated : str;
};

export const decompressStrict = (str: string, out?: Uint8Array): string => {
    if (!isCompressed(str)) return str;

    const arr = ShortString.toByteArray(str.slice(MINIE_SHORT_PREFIX.length + MINIE_UID_PREFIX_LENGTH, -MINIE_SHORT_SUFFIX.length));
    const decompressed = decompressSync(arr, out);
    return ByteArray.toString(decompressed);
};

export const decompress = (str: string, out?: Uint8Array): string => {
    if (!hasCompressed(str)) return str;

    let currentSegment = '';
    let decompressed = '';

    for (const char of Array.from(str)) {
        if (char === MINIE_SHORT_PREFIX) {
            if (currentSegment.length) {
                throw new Error(`Invalid compressed string (segment already started)`);
            }
            currentSegment += char;
        } else if (char === MINIE_SHORT_SUFFIX) {
            if (!currentSegment.length) {
                throw new Error('Invalid compressed string (segment not started)');
            }
            currentSegment += char;
            decompressed += decompressStrict(currentSegment, out);
            currentSegment = '';
        } else if (currentSegment.length) {
            currentSegment += char;
        } else {
            decompressed += char;
        }
    }

    return decompressed;
};

export const decompressDeep = (str: string, out?: Uint8Array): string => {
    let decompressed = decompress(str, out);
    while (hasCompressed(decompressed)) {
        decompressed = decompress(decompressed, out);
    }
    return decompressed;
};
