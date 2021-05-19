export interface Question {
  id: number;
  query: string;
  options: Option[];
}

export interface Option {
  id: number;
  text: string;
}
