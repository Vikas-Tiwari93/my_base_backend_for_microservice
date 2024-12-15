import { resolve as tsResolve } from 'ts-node/esm';

export async function resolve(specifier, context, defaultResolve) {
    const resolved = await tsResolve(specifier, context, defaultResolve);
    return resolved;
}

export { load, getFormat, transformSource } from 'ts-node/esm';