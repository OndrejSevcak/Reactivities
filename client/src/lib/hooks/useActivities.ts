import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";

export const useActivities = (id?: string) => {
    const queryClient = useQueryClient(); 

    const {data: activities, isPending} = useQuery({    // -> {data: activities, isPending} is destructuring assignment
        queryKey: ['activities'],
        queryFn: async () => {
          const response = await agent.get<Activity[]>('/activities');  //base url is configured globally in agent.ts file
          return response.data;
        }
    })

    //is executed every time a component is mounted be default
    //we want this to be executed only when when we have the id -> using the enabled property
    const {data: activity, isLoading: isLoadingActivity} = useQuery({
        queryKey: ['activities', id],
        queryFn: async () => {
            const response = await agent.get<Activity>(`/activities/${id}`);
            return response.data;
        },
        enabled: !!id,   //!!id is a boolean value that is true if id is not null or undefined
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
            const response = await agent.post('/activities', activity);
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries(    
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
        deleteActivity,
        activity,
        isLoadingActivity
    }
}