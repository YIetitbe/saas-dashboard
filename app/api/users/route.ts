import { NextRequest, NextResponse } from "next/server"
import { UserSchema } from "../../../features/users/types"

let users = [
  { id: '1', firstName: 'Britney', lastName: 'Spears', email: 'britney@test.com', role: 'admin' },
  { id: '2', firstName: 'Paris', lastName: 'Hilton', email: 'paris@test.com', role: 'editor' },
  { id: '3', firstName: 'Lenny', lastName: 'Kravitz', email: 'lenny@test.com', role: 'viewer' },
  { id: '4', firstName: 'Kim', lastName: 'Kardashian', email: 'kim@test.com', role: 'admin' },
  { id: '5', firstName: 'Axl', lastName: 'Rose', email: 'axl@test.com', role: 'viewer' },
  { id: '6', firstName: 'Mary', lastName: 'J Blige', email: 'mary@test.com', role: 'editor' },
  { id: '7', firstName: 'Kurt', lastName: 'Cobain', email: 'kurt@test.com', role: 'viewer' },
  { id: '8', firstName: 'Jennifer', lastName: 'Lopez', email: 'jennifer@test.com', role: 'admin' }
]

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const page = parseInt(url.searchParams.get('page') || '1')
  const limit = parseInt(url.searchParams.get('limit') || '10')
  const search = url.searchParams.get('search')?.toLowerCase() || ''
  const role = url.searchParams.get('role') as string | null

  let filteredUsers = users.filter(
    (u) =>
      (u.firstName.toLowerCase().includes(search) ||
        u.lastName.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search)) &&
      (!role || role === 'all' || u.role === role)
  )
  const start = (page - 1) * limit
  const paginatedUsers = filteredUsers.slice(start, start + limit)
  
  return NextResponse.json({
   data: paginatedUsers,
   total: filteredUsers.length,
  })
}

export async function PATCH(req: NextRequest) {
    const body = await req.json()
    const {id, role} = body

    const userIndex = users.findIndex(u => u.id === id)
    if (userIndex === -1) {
        return NextResponse.json({ error: 'User not found'},{ status: 404})
    }

    users[userIndex] = { ...users[userIndex], role }

    const parsed = UserSchema.parse(users[userIndex])

    return NextResponse.json(parsed)
}