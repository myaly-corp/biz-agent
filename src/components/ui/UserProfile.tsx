import { useFormStore } from "@/lib/store";
import { UserButton, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
// import { dark } from "@clerk/themes";


function UserProfile() {
    const { user, isLoaded } = useUser();
      const setUserId = useFormStore(state => state.setUserId)
      useEffect(() => {
        if (user?.id) {
          setUserId(user.id)
         
          
        }
      }, [user])
    return <div className='flex items-center bg-primary/20 rounded-lg border-2 border-white w-fit mx-2  lg:mx-6 mt-1  pl-4 '>
        {isLoaded && user && (
            <h1 className="text-black  font-extrabold text-lg">Hello, {user.firstName}</h1>
        )}
        <UserButton
            userProfileMode="modal"
            appearance={{
                // baseTheme: dark,
                elements: {
                    userButtonAvatarBox: 'w-10 h-10', // Make avatar larger
                    userButtonTrigger: 'p-2',         // Optional: increase padding
                },
            }}
        >
            
        </UserButton>
    </div>

}

export default UserProfile