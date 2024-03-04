import Layout from './components/UI/layout.component';
import AuthForms from './pages/authentication/AuthForms';
import Messenger from './pages/messenger/Messenger';

import Notifification from './components/Notification/Notification';
import useAuth from './hooks/useAuth';

import './App.css';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className='App'>
      <Layout>{isAuthenticated ? <Messenger /> : <AuthForms />}</Layout>
      <Notifification />
    </div>
  );
}

export default App;
