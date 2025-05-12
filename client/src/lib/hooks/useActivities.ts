import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useActivities = () => {
    const {data: activities, isPending} = useQuery({    // -> {data: activities, isPending} is destructuring assignment
        queryKey: ['activities'],
        queryFn: async () => {
          const response = await axios.get<Activity[]>('https://localhost:7001/api/activities');
          return response.data;
        }
    })

    return {activities, isPending}
}