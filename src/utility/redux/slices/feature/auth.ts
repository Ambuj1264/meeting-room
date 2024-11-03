import { createSlice } from "@reduxjs/toolkit";

import Cookies from "js-cookie";
const token = Cookies.get("userToken");
const userDetails = Cookies.get("userInfo")
export const authSlice = createSlice({
    
    name:"auth",
    initialState:{
        isAuthenticated: token ? true : false,
        user: token ? JSON.parse(userDetails!) : {}
    },

    reducers:{
        login:(state)=>{
            //find token from cookies

            const token = Cookies.get("userToken");
            const userDetails = Cookies.get("userInfo");
            if(token){
                state.user = JSON.parse(userDetails!);
                state.isAuthenticated=true;
            }
            else{
                state.isAuthenticated=false;
                state.user={}
            }

        },
        logout:(state)=>{   
            state.isAuthenticated=false;
        }
    }
})

export const {login,logout} = authSlice.actions
export default authSlice.reducer