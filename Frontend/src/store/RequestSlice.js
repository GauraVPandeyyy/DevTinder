import { createSlice }  from "@reduxjs/toolkit";

const requestSlice = createSlice({
    name:"requests",
    initialState:null,
    reducers:{
        addRequest : (state, action)=> action.payload,
        removeRequest:(state,action)=>{
            const newRequestsArray = state.filter(user=> user._id==action.payload)
            return newRequestsArray
        }
    }
})

export const {addRequest,removeRequest} = requestSlice.actions

export default requestSlice.reducer