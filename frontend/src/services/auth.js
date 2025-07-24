import { baseApi } from "./api"


export const signUp = async ({username, email, password}) => {
    try {
        const body = {
            username, email, password
        }
        
        return (await baseApi.post("/auth/signup", body)).data

    } catch(e) {
       console.log("Fail in sign up user", e)
    }
}

export const signIn = async ({email, password}) => {
    try {
        const body = {
            email, password
        }

        return (await baseApi.post("/auth/login", body)).data
    } catch(e) {
        console.log("Fail in sign in user", e)
    }
}