import { useState } from "react";
import { useSelector } from "react-redux";
import apiClient from "../util/interseptor";
export default function Support() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const user = useSelector(state => state.auth.currentUser)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    try {

      const response = await apiClient.post('/freshcart/user/support',data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if(response.data.status == 'success'){
        setIsSubmitted(true)
        event.target.reset()
} 
      else {
        console.log('Message sending failed')
        response.data.messsage
      }
    }catch(error) {
      console.log('Message sending failed')
    }
  }
  return (
    <div className="h-screen mt-[8rem] w-full bg-gray-100 flex justify-center">
        {
            isSubmitted && (
                <div className="flex flex-col w-full h-[28rem] items-center">
                    <div className="">
                        <img src="/supportSubmitted.png" alt="" className="w-[18rem]"/>
                    </div>
                    <img src="/success.gif" alt="" className="w-[10rem]"/>
                    <h1 className="poppins-semibold text-md">Thanks for contacting us!</h1>
                    <p className="poppins-regular text-sm text-gray-400">we will soon responds you</p>
                </div>
                
            )
        }

      {!isSubmitted && (
        <div className="w-full flex h-full justify-center">
        <img src="/support.png" alt="" className="w-[40%] object-contain"/>
        <div className="bg-white p-8 flex rounded-md justify-center w-[50%] h-[22rem] mt-[4rem]">
          <form
            action=""
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 items-center "
          >
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="poppins-semibold text-gray-500 text-md"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="poppins-semibold text-gray-700 border-2 border-gray-400 rounded-md p-1 w-[18rem]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="message"
                className="poppins-semibold text-gray-500 text-md"
              >
                Message
              </label>
              <textarea
                name="message"
                id="message"
                required
                className="poppins-semibold text-gray-700 resize-none  border-2 border-gray-400 rounded-md p-1 w-[18rem] h-[8rem]"
              ></textarea>
            </div>
            <div>
              <button className="p-2 poppins-semibold text-white text-md rounded-md bg-myGreen-dark disabled:bg-gray-400" disabled={!user}>
                Submit
              </button>
            </div>
          </form>
        </div>
        </div>
        
      )}
    </div>
  );
}
