export class User {
  id: string
  email?: string
  name?: string
  roles?: {
    [role: string]: boolean
  }
}
