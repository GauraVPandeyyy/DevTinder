import React, { use } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const Chat = () => {
    const targetUserId = useParams().targetUserId;
    const currentUser = useSelector((state) => state.connections.find((conn) => conn._id === targetUserId));
    if(!currentUser){
        return <p className='mx-auto pt-20'>User Not Found</p>
    }
  return (
    <div className='min-h-screen bg-gray-900 text-white'>
      <div>Chat with {currentUser?.firstName} {" "}{currentUser?.lastName}</div>
      <div>
        {/* Chat UI goes here */}
        <div className='flex gap-2 justify-between items-center mt-4 fixed bottom-20 w-full p-4'>
            <input type="text" placeholder='Enter your Message' className='w-full bg-gray-600 text-white placeholder:text-gray-400 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500' />
            <button className='w-fit px-3 py-1 bg-gray-500 hover:bg-gray-600'>Send</button>
        </div>
    </div>
    </div>

  )
}

export default Chat