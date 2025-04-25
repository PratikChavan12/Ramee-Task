import "./App.css";
import Taskmaneger from "./components/Taskmaneger";
import RecordForm from "./components/recordForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function LayoutRoutes() {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<Taskmaneger />} />
        <Route path="record-list" element={<Taskmaneger />} />
        <Route path="register" element={<RecordForm />} />
        <Route path=":id" element={<RecordForm />} />
      </Route>
    </Routes>
  );
}

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <LayoutRoutes />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
