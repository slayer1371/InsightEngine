'use server'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth"

export async function uploadOrderData(rows: any[]) {
  const session = await getServerSession(authOptions)

  // 1. Safety Check: Ensure session and email exist
  if (!session || !session.user || !session.user.email) {
    return { success: false, message: "Unauthorized: Please log in." }
  }

  // 2. Get the User ID
  const currentUser = await prisma.user.findUnique({
    where: { 
      email: session.user.email 
    }
  })

  if (!currentUser) {
    return { success: false, message: "User record not found." }
  }

  if (!rows || rows.length === 0) {
    return { success: false, message: "No data found" }
  }

  try {
    // 3. Map the data
    const ordersToCreate = rows.map((row) => {
      // Clean up the product name
      const productName = row.product_name || row.item || "Imported Item";
      
      return {
        // Order Fields
        totalAmount: parseFloat(row.amount || row.price || row.total || '0'),
        status: row.status?.toLowerCase() || 'completed',
        createdAt: new Date(row.date || row.created_at || new Date()),

        // Connect to User
        user: {
          connect: { id: currentUser.id } 
        },
        
        // Nested Item Creation
        items: {
          create: {
            quantity: parseInt(row.quantity || '1'),
            
            // Connect/Create Product by NAME (Not ID)
            product: {
              connectOrCreate: {
                // This requires 'name' to be @unique in your Prisma Schema
                where: { name: productName }, 
                create: {
                  name: productName,
                  price: parseFloat(row.amount || row.price || '0'),
                  category: row.category || "General", // 

                  user: {
                    connect: { id: currentUser.id }
                  }
                }
              }
            }
          }
        }
      }
    })

    // 4. Execute (Loop is required for nested writes)
    let count = 0
    for (const order of ordersToCreate) {
      await prisma.order.create({
        data: order
      })
      count++
    }

    return { success: true, count }
    
  } catch (error) {
    console.error("Upload error:", error)
    return { success: false, message: `Import failed: ${error instanceof Error ? error.message : "Unknown error"}` }
  }
}
// 'use server'

// import { authOptions } from '@/lib/auth'
// import { prisma } from '@/lib/prisma' // Adjust path if your prisma client is elsewhere
// import { getServerSession } from "next-auth"
// import { use } from 'react'

// export async function uploadOrderData(rows: any[]) {
//   const session = await getServerSession(authOptions)
//   if (!session || !session.user) {
//     return { success: false, message: "Unauthorized, need to be logged in!" }
//   }

//     const currentUser = await prisma.user.findUnique({
//         where: { 
//             email: session.user.email 
//         }
//     })

//     if (!currentUser) {
//         return { success: false, message: "User record not found." }
//     }

//   // Basic validation - ensure we have at least one row
//   if (!rows || rows.length === 0) {
//     return { success: false, message: "No data found" }
//   }

//   // Map CSV rows to Prisma schema
//   // We assume the user has mapped these columns or the CSV headers match roughly
//   try {
//     const ordersToCreate = rows.map((row) => ({
//       // Use defaults or parsing logic here
//       totalAmount: parseFloat(row.amount || row.price || row.total || '0'),
//       status: row.status?.toLowerCase() || 'completed',
//       createdAt: new Date(row.date || row.created_at || new Date()),

//       user: {
//         connect: { id: currentUser.id } 
//       },
      
//       // We create a dummy product for each line item for simplicity in this MVP
//       // In a real app, you'd match SKU or Product ID
//       items: {
//         create: {
//           quantity: parseInt(row.quantity || '1'),
//         //   price: parseFloat(row.amount || row.price || '0'),
//           product: {
//             connectOrCreate: {
//               where: { id: 'import-placeholder' }, // Simple hack to link all to a generic product or create new ones
//               create: {
//                 name: row.product_name || row.item || "Imported Item",
//                 price: parseFloat(row.amount || row.price || '0'),
//                 stock: 999,
//                 category: row.category || "General"
//               }
//             }
//           }
//         }
//       }
//     }))

//     // Note: Prisma createMany doesn't support nested relations (items).
//     // So we loop. For 1000s of rows, this is slow, but fine for an MVP.
//     // Optimized way: create products first, then orders.
    
//     let count = 0
//     for (const order of ordersToCreate) {
//       await prisma.order.create({
//         data: order
//       })
//       count++
//     }

//     return { success: true, count }
    
//   } catch (error) {
//     console.error("Upload error:", error)
//     return { success: false, message: "Database error during import" }
//   }
// }