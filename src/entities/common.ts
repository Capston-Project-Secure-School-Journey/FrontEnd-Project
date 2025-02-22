export interface OptionSelect {
  id: number;
  name: string;
}

export interface MenuItemEntity {
  key?: string;
  active?: boolean;
  icon?: string;
  label?: string;
  url?: string;
}

export interface QueryParamEntity {
  limit?: number;
  page?: number;
  sortBy?: string;
  direction?: string;
}

export interface MetaDataEntity {
  currentPage?: number;
  data?: Object;
  lastPage?: number;
  pageSize?: number;
  total?: number;
}
