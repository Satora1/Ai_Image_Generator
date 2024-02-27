import { UserButton } from '@clerk/nextjs'

const Home = () => {
  return (
    <header>
    <div>
      <p>  Home  </p>


      <UserButton afterSignOutUrl='/' />
    </div>
      </header>
  )
}

export default Home