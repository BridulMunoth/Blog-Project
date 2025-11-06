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
                const session = await AuthService.createAccount(data)
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
    <div className="flex items-center justify-center w-full py-12">
            <div className="relative mx-auto w-full max-w-lg rounded-2xl p-8 sm:p-10 shadow-2xl ring-1 ring-slate-900/10 backdrop-blur bg-white dark:bg-slate-800/90 dark:ring-slate-700 overflow-hidden force-light-bg force-light-ring">
            <div className="absolute inset-x-0 -top-1 mx-auto h-1.5 w-32 rounded-full bg-gradient-to-r from-orange-500 via-purple-500 to-cyan-500 shadow-lg shadow-orange-500/50"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-purple-500/5 to-cyan-500/5 pointer-events-none"></div>
            <div className="mb-6 flex justify-center">
                    <span className="inline-block w-full max-w-[140px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-semibold leading-tight text-slate-900 dark:text-slate-100 prefer-light">Sign up to create account</h2>
                <p className="mt-2 text-center text-sm text-slate-800 dark:text-slate-300 font-medium prefer-light">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
                    >
                        Login
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-6 text-center">{error}</p>}

                <form onSubmit={handleSubmit(signup)} className='mt-8 space-y-5'>
                    <Input 
                    label= "Full Name"
                    placeholder="Your full name"
                    type="text"
                    error={errors.text?.message} 
                    {...register("name", { required: true })} 
                    />
                    <Input
                    label="Email"
                    placeholder="you@example.com"
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
                    label="Password"
                    type="password"
                    error={errors.password?.message} 
                    placeholder="Create a strong password"
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
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    >Sign up</Button>
                </form>
            </div>

    </div>
  )
}

export default Signup
