import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { User, UserSchema } from './types'

export function useUsers(page = 1, limit = 10, search = '') {
  return useQuery({
    queryKey: ['users', page, limit, search],
    queryFn: async () => {
      const res = await fetch(`/api/users?page=${page}&limit=${limit}&search=${search}`)
      if (!res.ok) throw new Error('Errore nel recupero utenti')
      const data = await res.json()
      return {
        users: data.data.map((u: any) => UserSchema.parse(u)),
        total: data.total,
      }
    },
  })
}


export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, role }: { id: User['id']; role: User['role'] }) => {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, role }),
      })
      if (!res.ok) throw new Error('Errore aggiornamento utente')
      return UserSchema.parse(await res.json())
    },
    onMutate: async ({ id, role }) => {
      await queryClient.cancelQueries({ queryKey: ['users'] })
      const previousUsers = queryClient.getQueryData<User[]>(['users'])
      queryClient.setQueryData<User[]>(['users'], old =>
        old?.map(u => (u.id === id ? { ...u, role } : u)) ?? []
      )
      return { previousUsers }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData<User[]>(['users'], context.previousUsers)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}