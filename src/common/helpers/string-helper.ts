import slugify from 'slugify';

export const slugifyString = (key) => {
  return slugify(key, {
    replacement: '_',
    lower: true,
    trim: true,
    remove: /[*+~.()'"!:@]/g,
  });
};

export function capitalize(text?: string) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : '';
}
