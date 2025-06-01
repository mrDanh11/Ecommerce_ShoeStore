import React from 'react'
import INFO from '../json/example.json'
import ProductList from '../components/testSupabase';

const Home = () => {
  return (
    <>
        {/* <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Welcome to {INFO.storeName} Website, {INFO.username}!</h1>
        </div> */}

        <div>
          <h1>Shop Giay Demo</h1>
          <ProductList />
        </div>
    </>
  )
}

export default Home;