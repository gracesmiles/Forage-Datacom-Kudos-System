import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertKudo } from "@shared/routes";

// Define the expanded type for frontend usage based on schema relations
export type KudoWithUser = {
  id: number;
  message: string;
  category: string;
  createdAt: string; // JSON dates are strings
  fromUserId: string;
  toUserId: string;
  fromUser: {
    id: string;
    username: string;
    profileImageUrl?: string;
    firstName?: string;
    lastName?: string;
  };
  toUser: {
    id: string;
    username: string;
    profileImageUrl?: string;
    firstName?: string;
    lastName?: string;
  };
};

export function useKudos() {
  return useQuery({
    queryKey: [api.kudos.list.path],
    queryFn: async () => {
      const res = await fetch(api.kudos.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch kudos feed");
      return (await res.json()) as KudoWithUser[];
    },
  });
}

export function useCreateKudo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertKudo) => {
      const validated = api.kudos.create.input.parse(data);
      const res = await fetch(api.kudos.create.path, {
        method: api.kudos.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.kudos.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to send kudos");
      }
      return api.kudos.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.kudos.list.path] });
    },
  });
}
