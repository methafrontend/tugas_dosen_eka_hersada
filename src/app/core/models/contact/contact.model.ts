import { entityStoreFactory } from "@core/config/entity-store";

export interface Contact_m {
  id: string;
  nama: string;
  email: string;
  phone: number;
  isFavorite: boolean;
  createdAt: string;
}

export const Entity_Contact = entityStoreFactory<Contact_m>();
