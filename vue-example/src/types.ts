export interface IOrganization {
  name: string;
  ceo: string;
  number: string;
  id: number,
  address: {
    city: string;
    street: string;
    build: string;
  };
}

export type FormOrganization = Omit<IOrganization, "id"> & { id: number | null };

