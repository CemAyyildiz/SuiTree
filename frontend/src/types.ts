export interface Link {
  label: string;
  url: string;
  is_premium: boolean;
  price: string; // in MIST
}

export interface Theme {
  background_color: string;
  text_color: string;
  button_color: string;
  font_style: string;
}

export interface LinkTreeProfile {
  id: {
    id: string;
  };
  owner: string;
  title: string;
  avatar_cid: string;
  bio: string;
  links: Link[];
  theme: Theme;
  verified: boolean;
  view_count: string;
  earnings?: { value: string }; // Balance in MIST
}

