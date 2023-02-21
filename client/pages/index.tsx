import type { NextPage } from 'next'
import Header from '../components/Header'
import SwapComponent from '../components/SwapComponent'

const Home: NextPage = () => {
  return (
    <div className='w-full h-screen flex flex-col items-center justify-center bg-[#2D242F]'>
      <Header />
      <SwapComponent />
    </div>
  )
}

export default Home
