import slugify from "slugify";

export const slugifyString = (key) => {
  return slugify(key, {
    replacement: "_",
    lower: true,
    trim: true,
    remove: /[*+~.()'"!:@]/g,
  });
};
