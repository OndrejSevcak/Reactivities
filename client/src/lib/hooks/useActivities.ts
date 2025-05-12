import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";

export const useActivities = () => {
    const queryClient = useQueryClient(); 

    const {data: activities, isPending} = useQuery({    // -> {data: activities, isPending} is destructuring assignment
        queryKey: ['activities'],
        queryFn: async () => {
          const response = await agent.get<Activity[]>('/activities');  //base url is configured globally in agent.ts file
          return response.data;
        }
    })

    const updateActivity = useMutation({
        mutationFn: async (activity: Activity) => {
            await agent.put('/activities', activity);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries(    // lets you intelligently mark queries as stale(obsolete) and potentially refetch them too
                {queryKey: ['activities']});
        }
    })

    const createActivity = useMutation({
        mutationFn: async (activity: Activity) => {
            await agent.post('/activities', activity);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries(    // lets you intelligently mark queries as stale(obsolete) and potentially refetch them too
                {queryKey: ['activities']});
        }
    })

    const deleteActivity = useMutation({
        mutationFn: async (id: string) => {
            await agent.delete(`/activities/${id}`);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries(
                {queryKey: ['activities']});
        }
    })

    return {
        activities, 
        isPending,
        updateActivity,
        createActivity,
        deleteActivity
    }
}