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

  return loading ? (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="text-center">
        <div className="inline-block w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">Loading...</p>
      </div>
    </div>
  ) : <> {children} </>
}

