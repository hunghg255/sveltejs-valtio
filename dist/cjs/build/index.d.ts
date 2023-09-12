export * from 'valtio/utils';
interface Options {
    sync?: boolean;
}
declare function useSnapshot<T extends object>(proxyObject: T, options?: Options): {
    subscribe(fn: (payload: T) => void): () => void;
};
export { useSnapshot };
export { proxy, subscribe } from 'valtio/vanilla';
