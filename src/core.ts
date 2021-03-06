import { compressSync, decompressSync, GzipOptions } from 'fflate';
import { MINIE_SHORT_PREFIX, MINIE_UID_PREFIX_LENGTH } from './consts';
import { ReallyAny } from './types';

export const Text = {
    toByteArray(str: string): Uint8Array {
        return new Uint8Array(Buffer.from(str));
    },
};

export const ShortString = {
    toByteArray(str: string): Uint8Array {
        return new Uint8Array(Array.from(str).map((c) => CharCode.toByte(c.charCodeAt(0))));
    },
};

export const CharCode = {
    toByte(i: number) {
        // eslint-disable-next-line no-nested-ternary
        return i - (i > 63743 ? 8517 : i > 159 ? 69 : i > 46 && i < 130 ? 35 : i > 40 && i < 46 ? 34 : i > 34 && i < 40 ? 33 : 32);
    },
    random() {
        return Byte.toChar(Math.floor(Math.random() * 65535));
    },
};

export const Byte = {
    toCharCode(i: number): number {
        i += 32;
        if (i > 33 && i < 39) {
            i++;
        } else if (i > 38 && i < 44) {
            i += 2;
        } else if (i > 43 && i < 127) {
            i += 3;
        } else if (i > 126 && i < 55258) {
            i += 37; // === 160 - 128 + 3
        } else if (i > 55295) {
            i += 8485; // === 63744 - 55296 + 37
        }
        return i;
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
    return (typeof value === 'string' && value.startsWith(MINIE_SHORT_PREFIX));
};

export const compress = (str: string, opts: GzipOptions = { level: 9, mem: 6 }): string => {
    const arr = Text.toByteArray(str);
    const compressed = ByteArray.toShortString(compressSync(arr, opts));

    if (str.length <= compressed.length) return str;
    // Make sure the uid is unique and of the right length
    const uid = CharCode.random().slice(0, MINIE_UID_PREFIX_LENGTH);
    return `${MINIE_SHORT_PREFIX}${uid}${compressed}`;
};

export const decompress = (str: string, out?: Uint8Array): string => {
    if (!isCompressed(str)) return str;

    const arr = ShortString.toByteArray(str.slice(MINIE_SHORT_PREFIX.length + MINIE_UID_PREFIX_LENGTH));
    const decompressed = decompressSync(arr, out);
    return ByteArray.toString(decompressed);
};
