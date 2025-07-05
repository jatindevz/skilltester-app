'use client'
import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from "next/navigation"
import axios from 'axios'
import { signOut } from "next-auth/react"
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FullPageLoader } from '@/components/LoadingSpinner'

// Extracted FlowCard component with memoization
const FlowCard = React.memo(({ flow, refreshFlows }) => {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = useCallback(async () => {
    try {
      setIsDeleting(true)
      await axios.delete('/api/createflow', { data: { id: flow._id } })
      toast.success('Flow deleted successfully')
      refreshFlows()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete flow')
    } finally {
      setIsDeleting(false)
    }
  }, [flow._id, refreshFlows])

  const handleOpenFlow = useCallback(() => {
    router.push(`/dashboard/Review/${flow._id}`)
  }, [flow._id, router])

  return (
    <Card className="bg-[#051014] border-[#2E2F2F] hover:border-[#A599B5]/30 transition-colors">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="min-w-0">
            <CardTitle className="text-[#C2D6D6] truncate">
              {flow.flowname}
            </CardTitle>
            <CardDescription className="text-[#ACBDBA] mt-1 truncate">
              ID: {flow.flowIdx}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleOpenFlow}
              size="sm"
              className="text-[#C2D6D6] bg-[#2E2F2F] hover:bg-[#2E2F2F]/80"
            >
              Open
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              size="sm"
              className="text-[#C2D6D6] bg-[#2E2F2F] hover:bg-red-500/20 hover:text-red-400"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {flow.skills?.name?.length > 0 ? (
          <div className="mt-2">
            <p className="text-xs text-[#ACBDBA] mb-1">Skills:</p>
            <div className="flex flex-wrap gap-2">
              {flow.skills.name.map((skill, idx) => (
                <span
                  key={`${flow._id}-${idx}`}
                  className="bg-[#2E2F2F] text-[#ACBDBA] px-2 py-1 rounded text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-[#ACBDBA]/50 text-sm italic">No skills added yet</p>
        )}
      </CardContent>
    </Card>
  )
})
FlowCard.displayName = 'FlowCard'

// Extracted FlowCreationForm component
const FlowCreationForm = ({
  isOpen,
  toggleFlowForm,
  handleGenFlow,
  flowname,
  setFlowname,
  session
}) => {
  if (!isOpen) return null

  return (
    <Card className="bg-[#051014] border-[#2E2F2F] mb-6">
      <CardHeader>
        <CardTitle className="text-[#C2D6D6]">Create New Flow</CardTitle>
        <CardDescription className="text-[#ACBDBA]">
          Start tracking your skill development journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="text"
            placeholder="Flow name"
            value={flowname}
            onChange={(e) => setFlowname(e.target.value)}
            className="bg-[#051014] border-[#2E2F2F] text-[#C2D6D6] placeholder-[#ACBDBA]/50"
            autoFocus
          />
          <Button
            onClick={handleGenFlow}
            className="bg-gradient-to-r from-[#A599B5] to-[#ACBDBA] hover:from-[#A599B5]/90 hover:to-[#ACBDBA]/90 text-[#051014]"
          >
            Create
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const Dashboard = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [flows, setFlows] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [flowname, setFlowname] = useState('')

  // Derived state instead of separate flowCount state
  const flowCount = useMemo(() => flows.length, [flows])

  const fetchFlows = useCallback(async () => {
    if (status !== 'authenticated') return

    try {
      // setIsLoading(true)
      const { data } = await axios.get('/api/createflow')
      setFlows(data.flow || [])
    } catch (error) {
      console.error('Fetch flows error:', error)
      toast.error('Failed to load flows')
    } finally {
      setIsLoading(false)
    }
  }, [status])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchFlows()
    } else if (status === 'unauthenticated') {
      setIsLoading(false)
    }
  }, [status, fetchFlows])

  const handleGenFlow = useCallback(async () => {
    if (!flowname.trim()) {
      toast.warning('Please enter a flow name')
      return
    }

    try {
      setIsFormOpen(false)
      setIsRedirecting(true)
      const res = await axios.post('/api/createflow', { flowname })
      toast.success('Flow created successfully')
      router.push(`/dashboard/${res.data.flowid}/skills`)
    } catch (error) {
      console.error('Create flow error:', error)
      toast.error(error.response?.data?.error || 'Flow creation failed')
      // setIsRedirecting(false)
    }
  }, [flowname, router])

  const toggleFlowForm = useCallback(() => {
    const newState = !isFormOpen
    setIsFormOpen(newState)
    if (newState) {
      setFlowname(`${session?.user?.username || 'user'}/flow-${Date.now()}`)
    }
  }, [isFormOpen, session])

  if (isRedirecting) {
    return <FullPageLoader text="Redirecting..." />
  }

  if (status === 'loading' || isLoading) {
    return <FullPageLoader text="Loading dashboard..." />
  }

  if (status === 'unauthenticated') {
    return (
      <div className="p-4">
        <p className="text-[#ACBDBA] text-lg">
          You are not logged in. Please sign in to access your dashboard.
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-4xl mx-auto bg-[#051014]">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ACBDBA] to-[#A599B5] bg-clip-text text-transparent truncate">
            Welcome back, {session.user?.username || 'User'}!
          </h1>
          <p className="text-[#ACBDBA] mt-2">Your learning dashboard</p>
          <p className="text-[#ACBDBA] mt-4">
            Flows created: <span className="font-medium">{flowCount}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={toggleFlowForm}
            className="bg-gradient-to-r from-[#A599B5] to-[#ACBDBA] hover:from-[#A599B5]/90 hover:to-[#ACBDBA]/90 text-[#051014]"
          >
            {isFormOpen ? 'Cancel' : 'New Flow'}
          </Button>
          <Button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="border border-[#2E2F2F] text-[#C2D6D6] hover:bg-[#2E2F2F]/50"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Flow Creation Form */}
      <FlowCreationForm
        isOpen={isFormOpen}
        toggleFlowForm={toggleFlowForm}
        handleGenFlow={handleGenFlow}
        flowname={flowname}
        setFlowname={setFlowname}
        session={session}
      />

      <hr className="border-[#2E2F2F] my-6" />

      {/* Flows Section */}
      <div>
        <h2 className="text-xl font-semibold text-[#A599B5] mb-4">Your Learning Flows</h2>

        {flows.length === 0 ? (
          <Card className="bg-[#051014] border-[#2E2F2F] border-dashed text-center py-12">
            <p className="text-[#ACBDBA]">
              {isLoading ? 'Loading flows...' : 'No flows found. Create your first flow!'}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flows.map((flow) => (
              <FlowCard
                key={flow._id}
                flow={flow}
                refreshFlows={fetchFlows}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard