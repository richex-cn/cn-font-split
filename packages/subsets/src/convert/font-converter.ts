import {
    FontType,
    supportedFormats,
    detectFormat,
} from '../utils/detectFormat';
import { compress, decompress } from '@chinese-fonts/wawoff2';

/** 字体格式转化 */
export const convert = async function (
    buffer: Uint8Array,
    toFormat: FontType,
    fromFormat?: FontType
) {
    const snft = ['truetype', 'ttf', 'otf'];
    if (snft.includes(toFormat)) {
        toFormat = 'sfnt';
    }
    if (snft.includes(fromFormat || '')) {
        fromFormat = 'sfnt';
    }
    if (!supportedFormats.has(toFormat)) {
        throw new Error(`Unsupported target format: ${toFormat}`);
    }
    if (fromFormat) {
        if (!supportedFormats.has(fromFormat)) {
            throw new Error(`Unsupported source format: ${fromFormat}`);
        }
    } else {
        fromFormat = detectFormat(buffer);
    }
    if (fromFormat === toFormat) {
        return buffer;
    }
    if (fromFormat === 'woff') {
        // buffer = woffTool.toSfnt(buffer);
        throw new Error('Unsupported source format: woff');
    } else if (fromFormat === 'woff2') {
        buffer = await decompress(buffer);
    }
    if (toFormat === 'woff2') {
        buffer = await compress(buffer);
    }
    return buffer;
};
