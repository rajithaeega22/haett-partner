import { AuthProvider } from './hooks/useAuth';
import { ToastProvider } from './components/Toast';
import PartnerPage from './pages/PartnerPage';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <PartnerPage />
      </ToastProvider>
    </AuthProvider>
  );
}
