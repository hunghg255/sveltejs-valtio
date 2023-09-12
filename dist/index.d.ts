export * from 'valtio/utils';
export { proxy, subscribe } from 'valtio/vanilla';

interface Options {
    sync?: boolean;
}
declare function useSnapshot<T extends object>(proxyObject: T, options?: Options): {
    subscribe(fn: (payload: T) => void): () => void;
};

export { useSnapshot };
