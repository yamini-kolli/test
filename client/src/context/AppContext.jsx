import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export const AppContext = createContext()

const AppContextProvider =(props)=>{
    const[user,setUser] = useState(null);
    const[showLogin,setShowLogin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'))

    const [credit, setCredit] = useState(false)

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const navigate = useNavigate()

    const checkAndRestoreCredits = async () => {
        const stored = localStorage.getItem('lastCreditUsedTime');
        if (stored) {
            const lastUsed = new Date(stored);
            const now = new Date();
            const hoursPassed = (now - lastUsed) / (1000 * 60 * 60);

            if (hoursPassed >= 24) {
                try {
                    // Secure request to backend to update credits
                    const { data } = await axios.post(
                        backendUrl + '/api/user/add-credits',
                        { amount: 2 },
                        { headers: { token } }
                    );

                    if (data.success) {
                        toast.success("+2 credits added!");
                        localStorage.removeItem('lastCreditUsedTime');
                        setCredit(data.credits);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
    };


    const loadCreditsData = async ()=>{
        try{
            await checkAndRestoreCredits();
            const {data} = await axios.get(backendUrl + '/api/user/credits', {headers: {token}})

            if(data.success){
                setCredit(data.credits)
                setUser(data.user)
            }
        }
        catch(error){
            console.log(error)
            toast.error(error.message)
        }
    };

    const generateImage = async (prompt)=>{
        try{
            const {data} = await axios.post(backendUrl + '/api/image/generate-image', {prompt}, {headers: {token}});

            
            if(data.success){
                loadCreditsData()
                return data.resultImage;
            }
            else{
                toast.error(data.message)
                loadCreditsData()
                if(data.creditBalance === 0){
                    localStorage.setItem('lastCreditUsedTime', new Date().toISOString());
                    navigate('/out-of-credits'); // ⬅ Go to timer page
                }
            }
        }
        catch(error){
            toast.error(error.message)
        }
    }

    const logout = ()=>{
        localStorage.removeItem('token');
        setToken('')
        setUser(null)
    }

    useEffect(()=>{
        if(token){
            loadCreditsData()
        }
    },[token])


    const value ={
        user,setUser,showLogin,setShowLogin, backendUrl,token,setToken, credit, setCredit,loadCreditsData,logout,generateImage
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider
