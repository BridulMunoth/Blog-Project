import React,{useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function Protected({children , authentication= true}) {
    const navigate = useNavigate()
    const authStatus = useSelector((state) => state.auth.status)
    const [loading, setLoading] = useState(true)


useEffect(() => {
    if (authStatus === null) {
        setLoading(true)
    } else {
        setLoading(false)
        if (authentication && !authStatus) {
            navigate('/login')
        } else if (!authentication && authStatus) {
            navigate('/')
        }
    }
}, [authStatus, authentication, navigate])

  return loading ? <h1>Loading...</h1>:<> {children} </>
}

