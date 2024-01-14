export interface IProperties {
  search: null;
  pageIndex: number;
  pageSize: number;
  total: number;
  registers: Register[];
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface Register {
  id: string;
  descripcion: string;
  precio: number;
  area: string;
  bano: number;
  parqueadero: number;
  estrato: number;
  administracion: boolean;
  direccion: string;
  idTipoOfertafk: string;
  idTipoDominiofk: string;
  idCiudadfk: string;
  idPublicistafk: string;
}
