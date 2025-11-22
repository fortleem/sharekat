'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Mock database operations - in real implementation this would connect to your database
const mockDatabase = {
  investments: [
    { 
      id: 3, 
      projectId: 3, 
      amount: 2500, 
      userId: '1',
      status: 'pending',
      paymentDue: '2025-11-17T23:59:59',
      securityDeposit: 125
    },
    { 
      id: 5, 
      projectId: 1, 
      amount: 10000, 
      userId: '1',
      status: 'pending',
      paymentDue: '2025-12-17T23:59:59',
      securityDeposit: 500
    }
  ],
  users: [
    { id: '1', name: 'Ahmed Mohamed', email: 'ahmed@example.com', notifications: [] }
  ],
  projects: [
    { id: 1, title: 'Solar Farm Expansion - Upper Egypt', currentFunding: 1875000, target: 2500000 },
    { id: 3, title: 'Renewable Water Desalination Plant', currentFunding: 1250000, target: 3200000 }
  ]
}

export async function runAutoEliminationJob() {
  try {
    const now = new Date()
    const eliminatedCount = 0
    const notifications = []
    
    console.log('🚀 Starting Auto-Elimination Job...')
    console.log(`⏰ Current time: ${now.toISOString()}`)
    
    // Find overdue investments
    const overdueInvestments = mockDatabase.investments.filter(inv => {
      const paymentDue = new Date(inv.paymentDue)
      return inv.status === 'pending' && paymentDue < now
    })
    
    console.log(`🔍 Found ${overdueInvestments.length} overdue investments to process`)
    
    // Process each overdue investment
    for (const investment of overdueInvestments) {
      try {
        console.log(`🔧 Processing investment ID: ${investment.id} (Project: ${investment.projectId})`)
        
        // Get user and project details
        const user = mockDatabase.users.find(u => u.id === investment.userId)
        const project = mockDatabase.projects.find(p => p.id === investment.projectId)
        
        // Update investment status to 'eliminated'
        const investmentIndex = mockDatabase.investments.findIndex(i => i.id === investment.id)
        if (investmentIndex !== -1) {
          mockDatabase.investments[investmentIndex] = {
            ...mockDatabase.investments[investmentIndex],
            status: 'eliminated',
            eliminatedAt: now,
            eliminationReason: 'Payment deadline exceeded (48 hours)'
          }
          
          eliminatedCount++
          
          // Create notification for user
          if (user) {
            const notification = {
              id: Date.now(),
              userId: user.id,
              type: 'elimination',
              title: 'Investment Eliminated',
              message: `Your investment of ${investment.amount.toLocaleString()} EGP in "${project?.title}" has been automatically eliminated due to non-payment within the 48-hour deadline. Your security deposit of ${investment.securityDeposit.toLocaleString()} EGP has been forfeited.`,
              read: false,
              createdAt: now
            }
            
            user.notifications.push(notification)
            notifications.push(notification)
            
            console.log(`📧 Created notification for user ${user.id}: ${notification.message}`)
          }
          
          // Update project funding (remove this investment amount)
          if (project) {
            const projectIndex = mockDatabase.projects.findIndex(p => p.id === project.id)
            if (projectIndex !== -1) {
              mockDatabase.projects[projectIndex] = {
                ...mockDatabase.projects[projectIndex],
                currentFunding: Math.max(0, mockDatabase.projects[projectIndex].currentFunding - investment.amount)
              }
              
              console.log(`💰 Updated project ${project.id} funding: ${mockDatabase.projects[projectIndex].currentFunding.toLocaleString()} EGP`)
            }
          }
          
          console.log(`✅ Successfully eliminated investment ID: ${investment.id}`)
        }
      } catch (error) {
        console.error(`❌ Error processing investment ID ${investment.id}:`, error)
      }
    }
    
    console.log(`✨ Auto-Elimination Job completed successfully`)
    console.log(`📊 Summary: ${eliminatedCount} investments eliminated, ${notifications.length} notifications created`)
    
    // Revalidate relevant paths to update UI
    revalidatePath('/investments')
    revalidatePath('/dashboard')
    revalidatePath('/projects')
    
    return {
      success: true,
      eliminatedCount,
      processedCount: overdueInvestments.length,
      notificationsCreated: notifications.length,
      timestamp: now
    }
    
  } catch (error) {
    console.error('❌ Auto-Elimination Job failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date()
    }
  }
}

// Simulate running the job every 5 minutes (in development)
if (process.env.NODE_ENV === 'development') {
  setInterval(async () => {
    console.log('⏰ Auto-Elimination Job timer triggered (development mode)')
    await runAutoEliminationJob()
  }, 5 * 60 * 1000) // 5 minutes
}

export async function getAutoEliminationStatus() {
  const now = new Date()
  const pendingEliminations = mockDatabase.investments.filter(inv => {
    const paymentDue = new Date(inv.paymentDue)
    return inv.status === 'pending' && paymentDue < now
  })
  
  return {
    pendingEliminations: pendingEliminations.length,
    lastRun: new Date(),
    nextScheduledRun: new Date(now.getTime() + 5 * 60 * 1000) // 5 minutes from now
  }
}
