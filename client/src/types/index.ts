export const NATIONALITIES = [
  'CANADIAN',
  'BRAZILIAN',
  'AMERICAN',
  'INDIAN',
  'CHINESE',
  'GERMAN',
  'COLLOMBIAN',
] as const

export type Nationality = (typeof NATIONALITIES)[number]

export interface User {
  id: string
  name: string
  username: string
  age: number
  nationality: Nationality
  friends?: User[] | null
  favoritiesMovies?: Movie[] | null
}

export interface Movie {
  id: string
  name: string
  yearOfPublication: number
  isInTheaters: boolean
}