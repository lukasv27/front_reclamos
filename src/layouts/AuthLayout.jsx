import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Outlet />
    </div>
  )
}
