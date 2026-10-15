/**
 * Studio theme pack, node half. Pure UI plugin: the empty apply exists so the
 * plugin appears in the host cordis.yml / Loader; the browser half ships via
 * exports["./client"], discovered through the package.json dsh.client
 * declaration. The palettes and the backdrop artwork are browser-only facts —
 * nothing about them reaches the host.
 */

/** Host plugin body — no host-side behavior for this surface plugin. */
export function apply(): void {}
