import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import RouterMain from "./routes"

function App() {
  const queryClient = new QueryClient()
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterMain />
      </QueryClientProvider>
    </>
  )
}

export default App
