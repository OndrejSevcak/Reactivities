import { useQuery } from "@tanstack/react-query";
import agent from "../api/agent";

export const useActivities = () => {
    const {data: activities, isPending} = useQuery({    // -> {data: activities, isPending} is destructuring assignment
        queryKey: ['activities'],
        queryFn: async () => {
          const response = await agent.get<Activity[]>('/activities');  //base url is configured globally in agent.ts file
          return response.data;
        }
    })

    return {activities, isPending}
}