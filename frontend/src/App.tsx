import { RouterProvider, createBrowserRouter, Outlet} from 'react-router-dom'
import HomePage from './Pages/HomePage.tsx'
import MainPage from './Pages/MainPage.tsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: <><Outlet /></>,
    children: [
      { index: true, element: <HomePage /> },
      { path:":platform", element: <MainPage /> },
    ],
  }
]);


function App() {
  return < RouterProvider router={router}/>
}

export default App