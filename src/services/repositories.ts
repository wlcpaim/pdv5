import { Client, Supplier } from '../types';
import { db } from './db';

export const ClientRepository = {
  list: (): Client[] => db.getClients(),
  create: (client: Omit<Client, 'id'>) => {
    // Implementar lógica de criação com ID único
  },
};

export const SupplierRepository = {
  list: (): Supplier[] => db.getSuppliers(),
  create: (supplier: Omit<Supplier, 'id'>) => {
    // Implementar lógica de criação com ID único
  },
};
