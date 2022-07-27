const sizes = {
  MobileS: '320px',
  MobileM: '375px',
  MobileL: '425px',
  Tablet: '760px', // Font x2.5
  Laptop: '1024px',
  LaptopL: '1440px',
  Desktop: '2560px',
};

export const devices = {
  MobileS: `(max-width: ${sizes.MobileS})`,
  MobileM: `(max-width: ${sizes.MobileM})`,
  MobileL: `(max-width: ${sizes.MobileL})`,
  Tablet: `(max-width: ${sizes.Tablet})`,
  Laptop: `(max-width: ${sizes.Laptop})`,
  LaptopL: `(max-width: ${sizes.LaptopL})`,
  Desktop: `(max-width: ${sizes.Desktop})`,
};

export const colors = {
  Orange: '#EB811F',
  White: '#FDFDFC',
  SuperLightBrown: '#F7EFE7',
  LightBrown: '#E5D2C0',
  DarkBrown: '#584743',
  LightGray: '#B3B3AC',
  DarkGray: '#343638',
  Black: '#2B2A29',
};
