import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // 🔴 PASTE YOUR USER ID HERE
  const USER_ID = "cmkhmlxzk0000um3ttas1e30k"

  console.log(`🌱 Seeding data for User: ${USER_ID}...`)

  // 1. Create Products
  const products = await prisma.product.createManyAndReturn({
    data: [
      { userId: USER_ID, name: 'Wireless Headphones', category: 'Electronics', price: 199.99 },
      { userId: USER_ID, name: 'Ergo Office Chair', category: 'Furniture', price: 450.00 },
      { userId: USER_ID, name: 'Gaming Keyboard', category: 'Electronics', price: 129.50 },
      { userId: USER_ID, name: 'Smart Watch', category: 'Electronics', price: 299.00 },
      { userId: USER_ID, name: 'Yoga Mat', category: 'Fitness', price: 45.00 },
      { userId: USER_ID, name: 'Running Shoes', category: 'Fitness', price: 89.99 },
    ]
  })

  console.log(`✅ Created ${products.length} products`)

  // 2. Generate Random Orders (Last 30 Days)
  const ordersData = []
  const orderItemsData = []

  for (let i = 0; i < 50; i++) {
    const isRecent = i < 10 // Last 10 orders are "recent"
    const status = Math.random() > 0.1 ? 'completed' : 'pending' // 90% completed
    
    // Create Order
    const order = await prisma.order.create({
      data: {
        userId: USER_ID,
        status: status,
        totalAmount: 0, // Will calculate below
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
      }
    })

    // Add random items to order
    const randomProduct = products[Math.floor(Math.random() * products.length)]
    const quantity = Math.floor(Math.random() * 3) + 1
    
    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: randomProduct.id,
        quantity: quantity
      }
    })

    // Update total amount
    await prisma.order.update({
      where: { id: order.id },
      data: { totalAmount: Number(randomProduct.price) * quantity }
    })
  }

  console.log(`✅ Created 50 orders linked to your account.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })