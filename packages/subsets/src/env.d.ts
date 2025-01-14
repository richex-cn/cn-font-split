declare module '*.html' {
    const a: string;
    export default a;
}

declare module 'https://*' {
    const a: any;
    export const ensureDir: any;
    export const fileURLToPath: any;
    export const Md5: any;
    export default a;
}
declare module 'omt:*' {
    const a: string;
    export default a;
}
declare module 'https://deno.land/std@0.170.0/node/url.ts' {
    export * from 'node:url';
}
declare module 'comlink/dist/esm/node-adapter.mjs' {
    import { Endpoint } from 'comlink/dist/esm/protocol';
    export interface NodeEndpoint {
        postMessage(message: any, transfer?: any[]): void;
        on(
            type: string,
            listener: EventListenerOrEventListenerObject,
            options?: {}
        ): void;
        off(
            type: string,
            listener: EventListenerOrEventListenerObject,
            options?: {}
        ): void;
        start?: () => void;
    }
    export default function nodeEndpoint(nep: NodeEndpoint): Endpoint;
}
declare module '@konghayao/opentype.js' {
    export * from '@types/opentype.js';
}
declare module '@konghayao/opentype.js/dist/opentype.js' {
    export * from '@types/opentype.js';
}

// 这个是全局的静态文件声明，不要进行模块化
// export { }
