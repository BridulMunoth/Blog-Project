import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {login} from '../store/authSlice'
import {Button, Input, Logo} from './index'
import { useDispatch } from 'react-redux'
import AuthService from '../appwrite/auth'
import {useForm} from "react-hook-form"



function Signup() {
    const navigate = useNavigate()
        const dispatch = useDispatch()
        const [error, setError] = useState("")
        const {register, handleSubmit, formState: { errors }} = useForm()

        const signup = async (data) => {
            setError("")
            try {
                const session =  AuthService.createAccount(data)
                if (session) {
                    console.log("Session created:", session);
                    const user = await AuthService.getCurrentUser()
                    console.log("User signed up:", user);
                    user && dispatch(login(user))
                    navigate('/')
                }
            } catch (error) {
                setError(error.message)
            }
        }
  return (
    <div className="flex items-center justify-center">
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
            <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Login
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

                <form onSubmit={handleSubmit(signup)} className='mt-8'>
                    <div className='space-y-5'></div>
                    <Input 
                    label= "Full Name: "
                    placeholder="Enter your Full Name"
                    type="text"
                    error={errors.text?.message} 
                    {...register("name", { required: true })} 
                    />
                    <Input
                    label="Email: "
                    placeholder="Enter your email"
                    type="email"
                    error={errors.email?.message} 
                    {...register('email', {
                        required: true,
                        validate: {
                            matchPattern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                            "Email address must be a valid address",
                        }
                    })}
                    />
                    <Input
                    label="Password: "
                    type="password"
                    error={errors.password?.message} 
                    placeholder="Enter your password"
                    {...register('password', {
                        required: true,
                        validate: {
                            matchPattern: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(value) ||
                            "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
                        } 
                    })}
                    />
                    <Button
                    type="submit"
                    className="w-full"
                    >Sign up</Button>
                </form>
            </div>

    </div>
  )
}

export default Signup
