export const toTitleCase = (str: string): string => {
    return str.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase());
}