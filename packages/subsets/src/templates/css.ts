import { InputTemplate, SubsetResult } from '../interface';
import { NameTable } from './reporter';

const doubleFontWeightName = new Map([
    ['extra light', 200],
    ['ultra light', 200],
    ['extra bold', 800],
    ['ultra bold', 800],
    ['semi bold', 600],
    ['demi bold', 600],
]);
const singleFontWeightName = new Map([
    ['light', 300],
    ['normal', 400],
    ['regular', 400],
    ['medium', 500],
    ['bold', 700],
    ['heavy', 900],
    ['black', 900],
]);

export const subFamilyToWeight = (str: string) => {
    const name = [...doubleFontWeightName.keys()].find((i) => str.includes(i));
    if (name) return doubleFontWeightName.get(name);
    const singleName = [...singleFontWeightName.keys()].find((i) =>
        str.includes(i)
    );
    if (singleName) return singleFontWeightName.get(singleName);
    return 400;
};

export const isItalic = (str: string) => {
    return str.toLowerCase().includes('italic');
};
export const createCSS = (
    subsetResult: SubsetResult,
    nameTable: { windows?: NameTable; macintosh?: NameTable },
    opts: InputTemplate['css']
) => {
    const fontData = Object.fromEntries(
        Object.entries(nameTable?.windows ?? nameTable?.macintosh ?? {}).map(
            ([key, val]) => {
                return [key, typeof val === 'string' ? val : val.en];
            }
        )
    );
    const css = opts || {};
    const family =
        // fontData.preferredFamily  不使用这个，因为这个容易引起歧义
        css.fontFamily || fontData.fontFamily;

    const preferredSubFamily =
        fontData.preferredSubFamily || fontData.fontSubFamily || '';

    const style =
        css.fontStyle || (isItalic(preferredSubFamily) ? 'italic' : 'normal');

    const locals =
        typeof css.localFamily === 'string'
            ? [css.localFamily]
            : css.localFamily ?? [];
    locals.push(fontData.fontFamily);

    const polyfills =
        typeof css.polyfill === 'string'
            ? [
                  {
                      name: css.polyfill,
                      format: getKeyWordsFromFontPath(css.polyfill),
                  },
              ]
            : css.polyfill?.map((i) =>
                  typeof i === 'string'
                      ? {
                            name: i,
                            format: getKeyWordsFromFontPath(i),
                        }
                      : i
              ) ?? [];

    const weight = css.fontWeight || subFamilyToWeight(preferredSubFamily);
    const cssStyleSheet = subsetResult
        .map(({ path, unicodeRange }) => {
            let str = `@font-face {
font-family: "${family}";
src:${[
                ...locals.map((i) => `local("${i}")`),
                `url("./${path}") format("woff2")`,
                ...polyfills.map(
                    (i) =>
                        `url("${i.name}") ${
                            i.format ? `format("${i.format}")` : ''
                        }`
                ),
            ].join(',')};
font-style: ${style};
font-weight: ${weight};
font-display: ${css.fontDisplay || 'swap'};
unicode-range:${unicodeRange};
}`; // css 这个句尾不需要分号😭
            return css.compress !== false ? str.replace(/\n/g, '') : str;
        })
        .join('\n');
    const nameTableString =
        '\nOrigin File Name Table:\n' +
        Object.entries(fontData)
            .map((i) => i.join(': '))
            .join('\n');
    const baseMessage =
        `Generated By cn-font-split@${__cn_font_split_version__} https://www.npmjs.com/package/@konghayao/cn-font-split` +
        `\nCreateTime: ${new Date().toUTCString()};`;
    const header = `/* ` + baseMessage + nameTableString + '\n */\n\n';
    return header + cssStyleSheet;
};

const KeyWordsMap = {
    '.otc': 'collection',
    '.ttc': 'collection',
    '.eot': 'embedded-opentype',
    '.otf': 'opentype',
    '.ttf': 'truetype',
    '.svg': 'svg',
    '.svgz': 'svg',
    '.woff': 'woff',
    '.woff2': 'woff2',
};

const getKeyWordsFromFontPath = (path: string) => {
    const all = Object.keys(KeyWordsMap) as (keyof typeof KeyWordsMap)[];
    for (const iterator of all) {
        if (path.endsWith(iterator)) {
            return KeyWordsMap[iterator];
        }
    }
    return undefined;
};
