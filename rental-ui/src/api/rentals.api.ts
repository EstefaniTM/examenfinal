import { http } from "./http";
    
export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Rental = {
  id: number;
  vehicle_id: number;
  customer_name: string;
  total: number;
  status: string;
  vehicles_nombre?: string;
};

export async function listRentalsPublicApi() {
  const { data } = await http.get<Paginated<Rental>>("/api/rentals/");
  return data; // { ... , results: [] }
}

export async function listRentalsAdminApi() {
  const { data } = await http.get<Paginated<Rental>>("/api/rentals/");
  return data;
}

export async function createRentalApi(payload: Omit<Rental, "id">) {
  const { data } = await http.post<Rental>("/api/rentals/", payload);
  return data;
}

export async function updateRentalApi(id: number, payload: Partial<Rental>) {
  const { data } = await http.put<Rental>(`/api/rentals/${id}/`, payload);
  return data;
}

export async function deleteRentalApi(id: number) {
  await http.delete(`/api/rentals/${id}/`);
}