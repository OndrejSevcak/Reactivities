
# Reactivities Tutorial Notes

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
- `useState()` – for component state
- `useEffect()` – for side effects (e.g., API calls)

```tsx
useEffect(() => {
  console.log("Runs once after mount");
}, []);
```

### React Lifecycle Methods (Class Components)
- `componentDidMount()` – after initial render
- `componentDidUpdate()` – after updates
- `componentWillUnmount()` – before unmounting

### React StrictMode
- Wraps your app in development to highlight issues:
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

## Form Handling

### Controlled vs. Uncontrolled Inputs
```tsx
<TextField label="Title" defaultValue={activity?.title} />
const formData = new FormData(event.currentTarget);
```

## TanStack Query (React Query)

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

Docs: [TanStack Query](https://tanstack.com/query/latest/docs/framework/react)

## React Router Hooks
- `useNavigate()`
- `useParams()`
- `useSearchParams()`
- `useLocation()`

## TypeScript Basics

### `index.d.ts`
- Type definitions

### `map()` vs `forEach()`
- `map()` returns a new array
- `forEach()` does not return a new array (side effects only)

### Conditional Rendering
```tsx
if (activity.id) {
  // Safe check for null, undefined, 0, etc.
}
```

### Immutability in State Updates

```tsx
setActivities(activities.map(a => a.id === activity.id ? activity : a));

const newActivity = { ...activity, id: activities.length.toString() };
setActivities([...activities, newActivity]);
setSelectedActivity(newActivity);
```

## Architectural Patterns

### Clean Architecture (Uncle Bob)
- Domain-Centric
- Independent layers
- [Read the blog](https://blog.cleancoder.com/uncle-bob/2012/08/13/The-Clean-Architecture.html)

### CQRS – Command Query Responsibility Segregation
- **Commands** modify state (write)
- **Queries** return data (read)

#### CQRS Flow (Single DB):
```
Client -> API -> Application (CQRS) -> Persistence -> DB
```

### Mediator Pattern
- Decouples communication between objects
- Handlers communicate via Mediator, not directly

More: [CQRS + Mediator pattern guide](https://medium.com/@darshana-edirisinghe/cqrs-and-mediator-design-patterns-f11d2e9e9c2e)
