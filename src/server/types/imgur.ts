export interface ImgurUploadResponse {
  status: number;
  success: boolean;
  data: {
    id: string;
    deletehash: string;
    account_id: null;
    account_url: null;
    ad_type: null;
    ad_url: null;
    title: string;
    description: string;
    name: string;
    type:
      | "image/jpeg"
      | "image/jpg"
      | "image/gif"
      | "image/png"
      | "image/apng"
      | "image/tiff";
    width: number;
    height: number;
    size: number;
    views: number;
    section: null;
    vote: null;
    bandwidth: number;
    animated: boolean;
    favorite: boolean;
    in_gallery: boolean;
    in_most_viral: boolean;
    has_sound: boolean;
    is_ad: boolean;
    nsfw: null;
    link: string;
    tags: string[];
    datetime: number;
    mp4: string;
    hls: string;
  };
}
