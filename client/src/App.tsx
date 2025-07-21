import { createRouter, RouterProvider } from '@tanstack/react-router';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { AuthProvider } from '@/context/AuthContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { routeTree } from './routeTree.gen';
import './App.css';

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function AppWithProviders() {
  const auth = useSelector((state: RootState) => state.auth);

  return (
    <RouterProvider
      router={router}
      context={{
        auth,
      }}
    />
  );
}

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <AppWithProviders />
      </AuthProvider>
    </Provider>
  );
}

export default App;
