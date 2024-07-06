import 'regenerator-runtime/runtime'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from './context/AuthContext'
import { RouterProvider } from 'react-router-dom'
import { router } from './components/Router/Router'
import "./styles/index.scss";
import { SnackbarProvider } from './context/SnackbarContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <SnackbarProvider>
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  </SnackbarProvider>
)
