export class ProductEntity {
  id: string;
  name: string;
  store_id: string;
  description: string;
  price: number;
  promotion?: boolean;
  image_url: string[];
  category_id?: string;
  category?: {
    id: string;
    name: string;
  };
}
