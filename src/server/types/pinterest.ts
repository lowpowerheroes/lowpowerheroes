type PinterestOwner = {
  username: string;
};

type PinterestImageObject = {
  height?: number;
  url: string;
  width?: number;
};

export type PinterestBoardResponseSuccess = {
  id: string;
  created_at: string;
  board_pins_modified_at: string;
  name: string;
  description?: string;
  collaborator_count: number;
  pin_count: number;
  follower_count: number;
  media: {
    image_cover_url?: string;
    pin_thumbnail_urls: string[];
  };
  owner: PinterestOwner;
  privacy: "PUBLIC" | "PROTECTED" | "SECRET";
  is_ads_only: boolean;
};

export type PinterestResponseFail = {
  code: number;
  message: string;
};

export type PinterestPinResponseSuccess = {
  alt_text?: string;
  board_id: string;
  board_owner: PinterestOwner;
  board_section_id?: string;
  created_at: string;
  creative_type:
    | "REGULAR"
    | "VIDEO"
    | "SHOPPING"
    | "CAROUSEL"
    | "MAX_VIDEO"
    | "SHOP_THE_PIN"
    | "COLLECTION"
    | "IDEA"
    | "SHOWCASE"
    | "QUIZ";
  description?: string;
  dominant_color?: string;
  has_been_promoted: boolean;
  id: string;
  is_owner: boolean;
  is_standard: boolean;
  link: string;
  media: {
    media_type:
      | "image"
      | "video"
      | "multiple_image"
      | "multiple_video"
      | "multiple_mixed";
    images: PinterestImageObject[];
  };
  note?: string;
  parent_pin_id?: string;
  pin_metrics?: Record<string, unknown>;
  title?: string;
};
