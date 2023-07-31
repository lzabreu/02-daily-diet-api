declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
      password: string
      created_at: string
    }
    meals: {
      id: string
      name: string
      description: string
      created_at: string
      diet: boolean
      user_id: string
    }
  }
}
