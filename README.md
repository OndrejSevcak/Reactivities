
### Reactivities Tutorial Notes

## .NET Backend

### Prerequisites
- [.NET 9 SDK](https://dotnet.microsoft.com/en-us/download)

### Creating .NET Projects via CLI
```bash
dotnet new sln
dotnet new webapi -n API -controllers
dotnet new classlib -n Domain
dotnet new classlib -n Application
dotnet new classlib -n Persistence
dotnet sln add API
dotnet sln add Application
dotnet sln add Domain
dotnet sln add Persistence
```

- Open in VS Code:
```bash
code .
```

> In VSCode, use the **Solution Explorer** extension to browse projects and files.

### Running the API Project
```bash
cd API
dotnet run        # Starts the API
CTRL + C          # Stops the API
dotnet watch      # Starts and auto-restarts on changes
CTRL + R          # Manually restart (from terminal with watch running)
```

### Entity Framework Core
Install EF Tool globally:
```bash
dotnet tool install --global dotnet-ef --version 9.0.4
dotnet ef
```

Create the first migration:
```bash
dotnet ef migrations add InitialCreate -p Persistence -s API
```

Apply the migration:
```bash
dotnet ef database update -p Persistence -s API
```

## Validation

- using FluentValidation nuget package

**Creating a validation middleware to be added into MediatR pipeline**
```csharp
public class ValidationBehaviour<TRequest, TResponse>(IValidator<TRequest>? validator = null)
    : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        if (validator == null) return await next();

        var validationResult = await validator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        return await next();
    }
}
```

**Registering the middleware in Program.cs**
```csharp
builder.Services.AddMediatR(config =>
{
    config.RegisterServicesFromAssemblyContaining<GetActivityList.Handler>();   // Register all handlers in the assembly
    config.AddOpenBehavior(typeof(Application.Core.ValidationBehaviour<,>));    // Register the validation middleware
});
```

## Exception handling middleware

- a class implementing 'IMiddleware' interface 'InvokeAsync' method

```csharp
public async Task InvokeAsync(HttpContext context, RequestDelegate next)
{
    try
    {
        await next(context);    //trying to pass the request down the pipeline
    }
    catch (ValidationException ex)  //catching exception from our validation behaviour middleware
    {
        await HandleValidationException(context, ex);
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex);
    }
}
```

**HandleValidationException method that return a custom exception response**
```csharp
    private static async Task HandleValidationException(HttpContext context, ValidationException ex)
    {
        var validationErrors = new Dictionary<string, string[]>();

        if (ex.Errors is not null)
        {
            foreach (var error in ex.Errors)
            {
                if (validationErrors.TryGetValue(error.PropertyName, out var existingErrors))
                {
                    validationErrors[error.PropertyName] = existingErrors.Append(error.ErrorMessage).ToArray();
                }
                else
                {
                    validationErrors[error.PropertyName] = new[] { error.ErrorMessage };
                }

            }
        }

        context.Response.StatusCode = StatusCodes.Status400BadRequest;

        var validationProblemDetails = new ValidationProblemDetails(validationErrors)
        {
            Status = StatusCodes.Status400BadRequest,
            Title = "Validation Errors",
            Type = "ValidationFailure",
            Detail = "One or more validation errors occurred.",
        };

        await context.Response.WriteAsJsonAsync(validationProblemDetails);
    }
```

**Program.cs configuration**
```csharp
//adding services to the container
builder.Services.AddTransient<ExceptionMiddleware>();
//Http request pipeline
app.UseMiddleware<ExceptionMiddleware>();
```

**a 400 status code response now looks like this**
```json
{
    "type": "ValidationFailure",
    "title": "Validation Errors",
    "status": 400,
    "detail": "One or more validation errors occurred.",
    "errors": {
        "ActivityDto.Title": [
            "Title is required"
        ],
        "ActivityDto.Date": [
            "Date is required",
            "Date must be in the future"
        ],
        "ActivityDto.Description": [
            "Description is required"
        ],
        "ActivityDto.Category": [
            "Category is required"
        ],
        "ActivityDto.City": [
            "City is required"
        ],
        "ActivityDto.Venue": [
            "Venue is required"
        ],
        "ActivityDto.Latitude": [
            "Latitude is required"
        ],
        "ActivityDto.Longitude": [
            "Longitude is required"
        ]
    }
}
```

## Architectural Patterns in .NET backend

### Clean Architecture (Uncle Bob)
- Domain-Centric
- Independent layers
- [Read the blog](https://blog.cleancoder.com/uncle-bob/2012/08/13/The-Clean-Architecture.html)

**Our solution structure**
- API -> infrastructure layer
- Application -> use case layer
- Domain -> entities layer
- Persistence -> database layer
- client -> front-end (presentation) layer 

### CQRS – Command Query Responsibility Segregation
- separate reads and writes operations in applications
- read processes are called ‘Queries’ and Write processes are called ‘Commands’.
- https://medium.com/@darshana-edirisinghe/cqrs-and-mediator-design-patterns-f11d2e9e9c2e
	
  **Command** - does something (creates news object)
			- modifies state
			- should not return value
			
	**Query** - answers a question
		  - does not modify state
		  - should return a value
		  - examples: GetActivityList, GetActivityDetails
	
	**Single database CQRS Flow:**
		- DataBase -> DataAccess -> Query -> API -> Command -> Domain -> Persistence -> Database

**Create activity command**
```csharp
public class CreateActivity
{
    //// The Command class represents a command in the CQRS pattern. Commands are used to encapsulate data and intent for performing a specific action, such as creating an activity in this case.
    public class Command : IRequest<string>
    {
        public required Activity Activity { get; set; }
    }

    // The Handler class is responsible for handling the Command. It implements the IRequestHandler<Command, string> interface from MediatR, which is a library commonly used to implement CQRS in .NET applications.
    public class Handler(AppDbContext context) : IRequestHandler<Command, string>
    {
        public async Task<string> Handle(Command request, CancellationToken cancellationToken)
        {
            context.Activities.Add(request.Activity); //adds the activity to the context -> so there is no need to use Async version
            await context.SaveChangesAsync(cancellationToken); //only here we communicate with the database

            return request.Activity.Id; //returns the id of the activity that was created, because it is created server side
        }
    }
}
```
**Get activity detail query**
```csharp
public class GetActivityDetails
{
    //Here we define an Id query parameter to be passed to the handler
    public class Query : IRequest<Activity>
    {
        public required string Id { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Query, Activity>
    {
        public async Task<Activity> Handle(Query request, CancellationToken cancellationToken)
        {
            var activity = await context.Activities.FindAsync([request.Id], cancellationToken);

            if(activity == null) throw new Exception("Activity not found");

            return activity;
        }
    }
}
```

### Mediator Pattern
- Decouples communication between objects - helps to reduce the dependencies between objects
- Handlers communicate via Mediator, not directly - objects should do the communication through the mediator to prevent direct communication between each other

**MediatR package for .NET**
- package. https://github.com/jbogard/MediatR

```bash
dotnet add package MediatR
```

```csharp
//registration in Program.cs
builder.Services.AddMediatR(config => config.RegisterServicesFromAssemblyContaining<GetActivityList.Handler>());
```

More: [CQRS + Mediator pattern guide](https://medium.com/@darshana-edirisinghe/cqrs-and-mediator-design-patterns-f11d2e9e9c2e)

## React Frontend

### Prerequisites
- [Node.js](https://nodejs.org/)
- [Vite](https://vitejs.dev/)

### Creating the React Project
```bash
npm create vite@latest
# Choose: React + TypeScript
# Project name: client
cd client
npm install
npm run dev
```

### Key Project Files
- `vite.config.ts` – Dev server and bundler configuration
- `package.json` – Metadata, dependencies, and scripts

## React Basics

### Components
- A React component is a function that returns JSX.
- JSX allows embedding JavaScript variables using `{}`.

```tsx
const title = 'Welcome';
return <h1>{title}</h1>;
```

### Styling in JSX
- Inline styles: `style={{ color: 'red' }}`
- CSS classes: `className='myClass'`

### Hooks
- `useState()` – for component state, have 2 arguments - variable and setter function
- `useEffect()` – for side effects (e.g., API calls), we pass a callback, is executed when the component mounts, number of executions depends on dependency array parameter

#### - NO dependency array is provided -> executes after every render
```tsx
    useEffect(() => {
      console.log("Runs after every render");
    });
```

#### - EMPTY dependency array is provided -> Executes only once, like componentDidMount
```tsx
    useEffect(() => {
      console.log("Runs only once after initial render (mount)");
    }, []);
```

#### - WITH dependencies provided -> Executes after the first render and whenever that dependency(counter) changes.
```tsx
    useEffect(() => {
      console.log("Runs when `count` changes");
    }, [count]);
```

### React Lifecycle Methods (Class Components)
- `componentDidMount()` – after initial render, called once
- `componentDidUpdate()` – after updates, Called after every update (re-render), except the initial one.
- `componentWillUnmount()` – before unmounting, Called right before the component is removed from the DOM


| Lifecycle Event   | Hook-Based (Function)       | Class-Based Equivalent       |
| ----------------- | --------------------------- | ---------------------------- |
| On mount          | `useEffect(..., [])`        | `componentDidMount()`        |
| On update         | `useEffect(..., [deps])`    | `componentDidUpdate()`       |
| On unmount        | `return` from `useEffect()` | `componentWillUnmount()`     |
| On every render   | `useEffect()` (no deps)     | N/A                          |
| Before render     | Not directly possible       | `getDerivedStateFromProps()` |
| Should re-render? | Use `React.memo`            | `shouldComponentUpdate()`    |

### Lifecycle triggers

| Trigger                          | What Happens                       |
| -------------------------------- | ---------------------------------- |
| `useState()` call                | Triggers a re-render               |
| `props` change                   | Triggers a re-render               |
| `useEffect` with `[dep]` changes | Runs effect cleanup + effect again |
| Component removed from tree      | Runs cleanup (`return () => {}`)   |


### React StrictMode
- It’s a development-only feature that helps you write better, more robust code by warning you about potential issues in your app
- It does not render anything in the UI, but it activates additional checks and warnings in development. What it does?
1. Detects unsafe lifecycles in class components.
2. Warns about legacy string refs.
3. Highlights unexpected side effects in useEffect, useLayoutEffect.
4. Double-invokes functions like useEffect, useState initializers on purpose to help detect bugs in components that aren’t pure.

```tsx
<StrictMode>
  <App />
</StrictMode>
```

## HTTPS Support in Vite

Use [mkcert](https://github.com/FiloSottile/mkcert) to generate local certificates.

```bash
npm install -D vite-plugin-mkcert
```

## Material UI (MUI)

```bash
npm install @mui/material @emotion/react @emotion/styled
npm install @fontsource/roboto
npm install @mui/icons-material
```

Add to `main.tsx`:
```ts
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
```

## Axios – HTTP Client
```bash
npm install axios
```

```tsx
//configuring the axios http client
const agent = axios.create({
    baseURL: import.meta.env.VITE_API_URL, //url is stored in vite .env.development file
});
export default agent;

//using the agent in custom hook
import agent from "../api/agent";

const {data: activities, isPending} = useQuery({    // -> {data: activities, isPending} is destructuring assignment
        queryKey: ['activities'],
        queryFn: async () => {
          const response = await agent.get<Activity[]>('/activities');  //base url is configured globally in agent.ts file
          return response.data;
        }
    })
```

| Feature                | Benefit                                       |
| ---------------------- | --------------------------------------------- |
| Promise-based API      | Clean `async/await` code                      |
| Automatic JSON parsing | No need to call `res.json()` like `fetch`     |
| Interceptors           | Central place to add headers or handle errors |
| Timeout / cancel token | Easy control over slow/cancelled requests     |


## Form Handling

### Controlled vs. Uncontrolled Inputs
- uncontrolled default value -> use defaultValue instead of value
```tsx
<TextField label="Title" defaultValue={activity?.title} />
```

### Extracting form data using new FormData()
```tsx
  const formData = new FormData(event.currentTarget); //built-in browser API that allows you to easily construct a set of key/value pairs representing form fields and their values.
  const data: {[key: string]: FormDataEntryValue} = {}    //each key is a string and each value is a FormDataEntryValue (which can be a string or a File object)
  formData.forEach((value, key) => {
      data[key] = value;
  });
```

## TanStack Query (React Query)
- data fetching and state management(global state - asynchronous)
- caching, background fetching, synchronization
- less boilerplate then useState + useEffect

**Hooks**

- **useQuery()** -> getting data from server for the first time
                 OR getting same data again from different component, will get the cahed data from queryCache
- **useMutation()** ->making request that can change data on server(POST, UPDATE...) -> updating the same data on the server, (set, invalidate(new fetch from server), optimistic update the cache)

**Difference between useQuery and useMutation**

- It's a difference in what happens to the backend state. In a query the intention is that you're requesting a particular dataset from some source. The request does not change any backend state, and any re-requests for the data will also not cause a change to backend state.

- In a mutation the intention is to create some change in the backend state. (e.g. creating a new record in a database, or updating an existing record).


Install:
```bash
npm install @tanstack/react-query
npm install @tanstack/react-query-devtools
```

Set up in `main.tsx`:
```tsx
const queryClient = new QueryClient();

<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

### React query Cache states
- Each piece of data (called a query) in React Query goes through 3 states:

| State               | Description                                                                      |
| ------------------- | -------------------------------------------------------------------------------- |
| `fresh`             | Recently fetched and **valid** (no need to refetch)                              |
| `stale`             | **Potentially outdated** — will be refetched automatically in certain situations |
| `inactive`          | Component using the query has **unmounted**, but cache still holds the data      |
| `garbage collected` | Cache expired and removed (if not used recently)                                 |

- **By default, React Query considers fetched data to be stale immediately after it's loaded.**

### We can change how long data is considered “fresh” using staleTime:
```tsx
useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  staleTime: 1000 * 60 * 5  // 5 minutes
});
```

Docs: [TanStack Query](https://tanstack.com/query/latest/docs/framework/react)


## Using React Router
- https://reactrouter.com/start/data/routing

**Installation**
```bash
npm i react-router
```

**Creating the Router.tsx file**

```tsx
import App from "../layout/App";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    }
]);
```

```tsx
//changing <App /> for <RouterProvider router={router}> in Main.tsx
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
```

### React Router Hooks
- `useNavigate()` -> navigates to specified url paths
- `useParams()` -> return path parameter values
- `useSearchParams()`
- `useLocation()` -> returns current location name

**Getting the path id parameter from url**
```tsx
//route with id parameter
{path: 'activities/:id', element: <ActivityDetail />},

//getting the id value in components
const {id} = useParams();
```

**Navigating using useNavigate hook**
```tsx
const navigate = useNavigate();

navigate(`/activities/${id}`);
```

## Using MobX for client side state management
- simple state management library for react - using **observations**

```bash
npm install mobx
npm install mobx-react-lite
```

**Observables**
- we declare observables in a mobX store
- our react components then 'observe' twose observables
- they react to the state changes

**Actions**
- we have **Actions** to **update the 'observables'**
- anyone observing those observables will be notified about the update

**Computed properties**
- are created based on a stored state and they update as the state updates
- for example a getFullName() will combine firstName and lastName and will run every time those two state properties changes

**Reactions**
- we can take an **action** based on an observable state change and react to it

**How we will use MobX**
- we will create a class for our state store containing the properties we want to track
- then we will use the 'Create context' which uses react context and we provide our demo store 
- finally by using useContext hook we will get access to our global state strore in our react components

**Setting up a simple 'CounterStore' state using MobX**

1. Creating a 'CounterStore' class
```tsx
//counterStore.ts
import { makeObservable, observable } from 'mobx';

export default class CounterStore {
    //class properties
    title = 'Counter Store';
    count = 0;

    constructor() {
        makeObservable(this, {
            title: observable,  //declaring that title is observable
            count: observable,
        });
    }
}
```

2. Creating the 'CounterStore' class intance and adding it to react context API
```tsx
//store.ts
import { createContext } from "react";
import CounterStore from "./counterStore";

interface Store {
    counterStore: CounterStore
}

export const store: Store = {
    counterStore: new CounterStore()
}

export const StoreContext = createContext(store);   //react hook to store global state
```

3. Creating the 'useStore()' hook to enable the store usage in react components
```tsx
import { useContext } from "react";
import { StoreContext } from "../stores/store";

export function useStore() {
    return useContext(StoreContext)
}
```

## React hook forms

**Instalation packages:**
- npm install @hookform/resolvers zod *(for validation)*
- npm install react-hook-form

***Documentation**:
- https://react-hook-form.com/docs/useform
- https://www.npmjs.com/package/@hookform/resolvers#zod

**Usage:**
```tsx
//useForm() hook methods
const { register, reset, handleSubmit } = useForm();

//input fields needs to be registered
<TextField {...register('title')} label="Title" defaultValue={activity?.title} />

//function to submit the form
const onSubmit = (data: FieldValues) => {
        console.log(data);
    }

//will be passed on the onSubmit form event
component="form" onSubmit={handleSubmit(onSubmit)}

////to reset the form we need to implement a useEffect hook
    useEffect(() => {
        if(activity) reset(activity);
    }, [activity, reset]);
```


## Other used npm packages

- [react-calendar](https://www.npmjs.com/package/react-calendar)
- [date-fns](https://date-fns.org/)

## Some TypeScript notes

### `index.d.ts`
- Type definitions

### `map()` vs `forEach()`
- `map()` returns a new array -> important for React to detect changes and trigger re-renders
- `forEach()` does not return a new array (side effects only)

### Conditional Rendering
- JavaScript/TypeScript treats certain values as **"falsy," such as null, undefined, 0, false, NaN, or an empty string ("")**.

```tsx
if (activity.id) {
  // Safe check for null, undefined, 0, etc.
  //If activity.id is any of these falsy values, the condition will evaluate to false.
}
```

### Typescript destructuring with default values and type annotations
-let have this parameter syntax:
```tsx
    mutationFn: async ({path, method = 'get'} : {path: string, method: string}) => {
      
    }
```

- *{path, method = 'get'}* This is object destructuring. It extracts the path and method properties from the object passed as an argument. If method is not provided, it defaults to 'get'.

- *: {path: string, method: string}* This is a type annotation. It tells TypeScript that the argument must be an object with path and method properties, both of type string.

### Typescript function that takes another function as parameter

- in TypeScript, you define that a function takes another function as a parameter by specifying the parameter’s type as a function signature. So there are no delegates like in C#

```tsx
//(message: string) => void is the type of the callback parameter: a function that takes a string and returns nothing.
function doSomething(callback: (message: string) => void) {
    callback("Hello from TypeScript!");
}

// Usage
doSomething((msg) => console.log(msg));
```

 - **with multiple parameters and return type**
```tsx
function calculate(a: number, b: number, operation: (x: number, y: number) => number): number {
    return operation(a, b);
}

calculate(2, 3, (x, y) => x + y); // returns 5
```

- **using type aliases**
```tsx
type StringCallback = (message: string) => void;
function doSomething(callback: StringCallback) { ... }
```

### Immutability in State Updates

```tsx
setActivities(activities.map(a => a.id === activity.id ? activity : a));
//same as
 setActivities(activities.map(a => {
  if(a.id === activity.id){
    return activity;
  }
  else{
    return a;
  }
}))
```
- the result of activities.map() is a new array and the length of resulting array is always the same as the original array
- in the new array the updated activity has replaced the old one, all other activities remain unchanged
- **This approach ensures immutability, a key principle in React state management.** 
- Instead of modifying the original activities array directly, a new array is created and used to update the state. 
- This helps React detect changes and re-render the component efficiently.

```tsx
const newActivity = { ...activity, id: activities.length.toString() };
setActivities([...activities, newActivity]);
setSelectedActivity(newActivity);
```
- expression [...activities] creates a shallow copy of the activities array (original array is not modified directly)
- expression {..activity, id: activities.length.toString()} creates a new object that contains all properties of the activity object and adds a new property id with a value of the    current length of the activities array
- The spread operator {...activity} copies all the properties of the activity object into the new object.
- The activities.length.toString() ensures that the id is a string representation of the array's length, which can serve as a simple unique identifier for the new activity.


## Link to the Udemy tutorial by Neil Cummings:
- [Complete guide to building an app with .Net Core and React](https://www.udemy.com/course/complete-guide-to-building-an-app-with-net-core-and-react/?srsltid=AfmBOooyDlfNiaOQ4FdLSF5YNZFf1JQtXtOrPZJCU-gKaBGQd56bOWFF&couponCode=CP130525)

- the author does a great job explaining general development concepts along with react basics and best practices (thats why I bought this course) and I would definitely recommend it to people with existing .NET experience wanting to dive into the world of React FE development