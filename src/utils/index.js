export function sanitizeInput(input) {
    console.debug("Sanitizing input:", input);

    return typeof input === 'string'
        ? input
        : (input?.sql || input?.query || input?.sql_query || input?.input || (input && typeof input === 'object' ? Object.values(input).find(v => typeof v === 'string') : null));
}