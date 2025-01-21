import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import RouterMain from "./routes"
import { HelmetProvider } from "react-helmet-async"

function App() {
  const queryClient = new QueryClient()
  return (
    <>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <RouterMain />
        </QueryClientProvider>
      </HelmetProvider>
    </>
  )
}

export default App
