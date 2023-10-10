import { Route, Routes, useNavigate } from 'react-router-dom'
import { AppRoutes, RouteNames } from './routes'
import TitleBar from './components/TitleBar'
import { useEffect } from 'react'
import Nav from './components/Nav'

const App = () => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate(RouteNames.ACCOUNTS)
  }, [])

  return (
    <div className={'appWrapper'}>
      <TitleBar />
      <Nav />
      <Routes>
        {AppRoutes.map((route) => (
          <Route action={route.action} key={route.path} element={route.element} path={route.path} />
        ))}
      </Routes>
    </div>
  )
}

export default App
